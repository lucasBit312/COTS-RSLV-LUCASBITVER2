import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import userApi from "../../Api/userApi";
import addressApi from "../../Api/address";
Address.propTypes = {
  user: PropTypes.object,
};

function Address(props) {
  const [user, setUser] = useState(props.user);
  const [loaddata, setLoaddata] = useState(false);
  const [address, setAddress] = useState([]);
  const schema = yup.object({
    contact_name: yup
      .string()
      .required("Vui lòng nhập họ và tên người liên hệ")
      .max(100, "Vui lòng nhập ít hơn 100 kí tự")
      .min(1, "Vui lòng nhập dài hơn 1 kí tự"),
    address: yup
      .string()
      .required("Vui lòng nhập địa chỉ")
      .min(30, "Vui lòng nhập địa chỉ hợp lệ"),

    contact_info: yup
      .string()
      .matches(/^[0-9]+$/, "Vui lòng chỉ nhập số điện thoại liên hệ")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại liên hệ"),
  });
  const {
    register: Profice,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await addressApi.addNewAddress(data);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoaddata(true);
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
  useEffect(() => {
    (async () => {
      try {
        const response = await addressApi.getAllAddress();
        setAddress(response);
      } catch (error) {
        console.log("Failed to fetch address", error);
      }
    })();
  }, [loaddata]);

  return (
    <Box marginBottom={4} minHeight={400} >
      <div className="row" style={{ display: "flex", justifyContent: "center" }}>
        <hr style={{ marginTop: "3px" }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="contact_name"
            size="small"
            label="Họ và tên người liên hệ"
            error={Boolean(errors.contact_name)}
            helperText={errors.contact_name?.message}
            {...Profice("contact_name")}
          />
          <TextField
            style={{ width: "100%", marginTop: "20px" }}
            id="address"
            size="small"
            label="Địa chỉ (Số nhà, Đường, Phường/Xã, Quận/Huyện, Thành phố/Tỉnh)"
            error={Boolean(errors.address)}
            helperText={errors.address?.message}
            {...Profice("address")}
          />
          <TextField
            style={{ width: "100%", marginTop: "20px" }}
            id="contact_info"
            size="small"
            label="Số điện thoại liên hệ"
            error={Boolean(errors.contact_info)}
            helperText={errors.contact_info?.message}
            {...Profice("contact_info")}
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
      <div className="row">
        {address.map((item, index) => (
          <div key={item.id}>
            <Typography className="p-2" style={{borderTop:"1px solid #CBCBCB"}}>Địa chỉ số {index + 1}: {item.contact_name}, {item.contact_info}, {item.address} </Typography>
          </div>
        ))}
      </div>
    </Box>
  );
}

export default Address;
