import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import addressApi from "../../Api/address";
import locationApi from "../../Api/location";
import NewAddress from "./NewAddress";
Address.propTypes = {
  user: PropTypes.object,
};

function Address(props) {
  const [loaddata, setLoaddata] = useState(false);
  const [address, setAddress] = useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRemove, setOpenRemove] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressRemove, setSelectedAddressRemove] = useState(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const response = await locationApi.getProvince();
        setProvinceList(response);
      } catch (error) {
        console.log("Failed to fetch province list", error);
      }
    };
    fetchProvinceList();
  }, []);

  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        if (province) {
          const response = await locationApi.getDistricts(province);
          setDistrictList(response);
        }
      } catch (error) {
        console.log("Failed to fetch district list", error);
      }
    };
    fetchDistrictList();
  }, [province]);
  useEffect(() => {
    setDistrict("");
  }, [province]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        if (district) {
          const response = await locationApi.getWards(district);
          setWardList(response);
        }
      } catch (error) {
        console.log("Failed to fetch ward list", error);
      }
    };
    fetchWardList();
  }, [district]);

  const handleClickOpenEdit = (address) => {
    setOpenEdit(true);
    setSelectedAddress(address);
    console.log(selectedAddress);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleClickOpenRemove = (address) => {
    setOpenRemove(true);
    setLoading(true);
    setSelectedAddressRemove(address);
    setLoading(false);
    console.log(selectedAddress);
  };
  const handleChangeProvince = async (event) => {
    const selectedProvince = event.target.value;
    setProvince(selectedProvince);

    try {
      const response = await locationApi.getDistricts(selectedProvince);
      setDistrictList(response);
    } catch (error) {
      console.log("Failed to fetch district list", error);
    }
  };

  const handleChangeDistrict = async (event) => {
    const selectedDistrict = event.target.value;
    setDistrict(selectedDistrict);

    try {
      const response = await locationApi.getWards(selectedDistrict);
      setWardList(response);
    } catch (error) {
      console.log("Failed to fetch ward list", error);
    }
  };
  const handleChangeWard = (event) => {
    setWard(event.target.value);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };
  const schema = yup.object({
    province_id: yup
      .number("Vui lòng chọn Tỉnh/Thành phố")
      .typeError("Vui lòng chọn Tỉnh/Thành phố")
      .required("Vui lòng chọn Tỉnh/Thành phố"),
    district_id: yup
      .number("Vui lòng chọn Huyện/Quận")
      .typeError("Vui lòng chọn Huyện/Quận")
      .required("Vui lòng chọn Huyện/Quận"),
    ward_id: ward
      ? yup
          .number("Vui lòng chọn Xã/Phường")
          .typeError("Vui lòng chọn Xã/Phường")
          .required("Vui lòng chọn Xã/Phường")
      : yup.mixed(),
    location: yup
      .string()
      .required("Vui lòng nhập Địa điểm cụ thể")
      .min(10, "Vui lòng nhập địa chỉ cụ thể dài hơn 10 kí tự")
      .max(100, "Vui lòng nhập địa chỉ ngắn hơn 100 kí tự"),
    contact_information: yup
      .string()
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại liên hệ")
      .max(11, "Vui lòng nhập ít hơn 11 kí tự"),
  });
  const {
    register: Profice,
    handleSubmit: submitNewAddress,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const fetchAddresses = async () => {
    try {
      const response = await addressApi.getAllAddress();
      setAddress(response);
    } catch (error) {
      console.log("Failed to fetch address", error);
    }
  };
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await addressApi.addNewAddress(data);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoaddata(true);
        fetchAddresses();
        setProvince("");
        setWard("");
        setDistrict("");
        reset();
      } else if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      } else if (result.errors) {
        enqueueSnackbar(result.errors[0], { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemove = async (data) => {
    try {
      const result = await addressApi.removeAddress(selectedAddressRemove?.id);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        handleCloseRemove();
        fetchAddresses();
        setLoaddata(true);
      } else if (result.errors) {
        enqueueSnackbar(result.errors[0], { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, [loaddata]);

  if (loading) {
    return <Typography>Đang load</Typography>;
  }
  return (
    <Box marginBottom={4} minHeight={400}>
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <hr style={{ marginTop: "3px" }} />
        <Typography className="p-3">Thêm mới địa chỉ</Typography>
        <form onSubmit={submitNewAddress(onSubmit)}>
          <FormControl style={{ marginTop: "24px", width: "100%" }}>
            <InputLabel id="label-province">Tỉnh</InputLabel>
            <Select
              labelId="label-province"
              id="province_id"
              value={province}
              label="Tỉnh"
              error={Boolean(errors.province_id)}
              {...Profice("province_id")}
              onChange={handleChangeProvince}
            >
              {provinceList.map((province) => (
                <MenuItem key={province.id} value={province.id}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
            {errors.province_id?.message ? (
              <p className="text-danger">{errors.province_id?.message}</p>
            ) : (
              ""
            )}
          </FormControl>
          {province ? (
            <FormControl style={{ marginTop: "24px", width: "100%" }}>
              <InputLabel id="label-district">Huyện</InputLabel>
              <Select
                labelId="label-district"
                id="district_id"
                value={district}
                label="Huyện"
                {...Profice("district_id")}
                onChange={handleChangeDistrict}
              >
                {districtList.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.district_id?.message ? (
                <p className="text-danger">{errors.district_id?.message}</p>
              ) : (
                ""
              )}
            </FormControl>
          ) : (
            ""
          )}
          {district ? (
            <FormControl style={{ marginTop: "24px", width: "100%" }}>
              <InputLabel id="label-ward">Phường/Xã</InputLabel>
              <Select
                labelId="label-ward"
                id="ward_id"
                value={ward}
                label="Huyện/Xã"
                {...Profice("ward_id")}
                onChange={handleChangeWard}
              >
                {wardList.map((ward) => (
                  <MenuItem key={ward.id} value={ward.id}>
                    {ward.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.ward_id?.message ? (
                <p className="text-danger">{errors.ward_id?.message}</p>
              ) : (
                ""
              )}
            </FormControl>
          ) : (
            ""
          )}
          <TextField
            error={Boolean(errors.location)}
            style={{ marginTop: "24px", width: "100%" }}
            id="location"
            size="small"
            label="Nhập địa chỉ cụ thể (số nhà, số đường)"
            defaultValue=""
            helperText={errors.location?.message}
            {...Profice("location")}
          />
          <TextField
            error={Boolean(errors.contact_information)}
            style={{ marginTop: "24px", width: "100%" }}
            id="contact_information"
            size="small"
            label="Số điện thoại liên hệ"
            defaultValue=""
            helperText={errors.contact_information?.message}
            {...Profice("contact_information")}
          />
          <Button
            variant="contained"
            color="warning"
            type="submit"
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Thêm địa chỉ
          </Button>
        </form>
      </div>
      {address.length > 0 ? (
        <Typography className="p-2">Danh sách địa chỉ</Typography>
      ) : (
        ""
      )}
      <div className="row">
        {address.map((item, key) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderTop: "1px solid #CBCBCB",
            }}
          >
            {item?.note === 1 ? (
              <Typography className="p-2 text-success">
                Địa chỉ số {key+1}: {item.contact_information},{" "}
                {item.ward.name}, {item.district.name}, {item.province.name}
                (Địa chỉ mặc định)
              </Typography>
            ) : (
              <Typography className="p-2">
                Địa chỉ số {key+1}: {item.contact_information},{" "}
                {item.location}, {item.ward.name}, {item.district.name},{" "}
                {item.province.name}
              </Typography>
            )}
            <div style={{ marginLeft: "auto" }} className="text-nowrap">
              <Button
                className="text-nowrap"
                onClick={() => handleClickOpenEdit(item)}
              >
                Cập nhật
              </Button>
              <Button onClick={() => handleClickOpenRemove(item)}>Xóa</Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cập nhật địa chỉ"}</DialogTitle>
        <NewAddress fetchAddresses={fetchAddresses} onClose={handleCloseEdit} selectedAddress={selectedAddress}></NewAddress>
      </Dialog>

      <Dialog
        open={openRemove}
        onClose={handleCloseRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa địa chỉ"}
        </DialogTitle>
        <DialogContent>Bạn có thực sự muốn xóa địa chỉ này?</DialogContent>
        <div className="text-end">
          <Button
            color="warning"
            style={{ marginTop: "16px", marginBottom: "16px" }}
            onClick={handleRemove}
          >
            Đồng ý
          </Button>
          <Button onClick={handleCloseRemove}>Hủy</Button>
        </div>
      </Dialog>
    </Box>
  );
}

export default Address;
