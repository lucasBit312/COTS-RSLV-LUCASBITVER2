import { yupResolver } from "@hookform/resolvers/yup";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import categoriesApi from "../../Api/categoriesApi";
import locationApi from "../../Api/location";
import foodAip from "../../Api/foodApi";
import { enqueueSnackbar } from "notistack";
DonateFood.propTypes = {};
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const ThumbnailImageDetail = styled("img")(({ theme, isSelected }) => ({
  borderRadius: "0.5em",
  objectFit: "cover",
  padding: "2px",
  width: "137px",
  height: "137px",
}));
function DonateFood(props) {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [timeConfirm, setTimeConfirm] = React.useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toISOString().slice(0, -8)
  );
  const handleChangeTimeConfirm = (event) => {
    setTimeConfirm(event.target.value);
  };
  const handleChange = (event) => {
    setCategory(event.target.value);
  };
  const handleChangeProvince = (event) => {
    setProvince(event.target.value);
  };
  const handleChangeDistrict = (event) => {
    setDistrict(event.target.value);
  };
  const handleChangeWard = (event) => {
    setWard(event.target.value);
  };

  const schema = yup.object({
    title: yup
      .string()
      .required("Vui lòng nhập tiêu đề")
      .max(100, "Vui lòng nhập ít hơn 100 kí tự")
      .min(10, "Vui lòng nhập dài hơn 10 kí tự"),
    category_id: yup
      .number()
      .typeError("Vui lòng chọn danh mục")
      .required("Vui lòng chọn danh mục"),
    description: yup
      .string()
      .required("Vui lòng nhập mô tả")
      .max(1000, "Vui lòng nhập ít hơn 1000 kí tự"),
    quantity: yup
      .number()
      .integer("Số lượng phải là số nguyên")
      .typeError("Vui lòng nhập số lượng")
      .min(1, "Vui lòng nhập số lượng lớn hơn 0")
      .required("Vui lòng nhập số lượng"),
    expiry_date: yup
      .date("Vui lòng nhập ngày hết hạn thực phẩm")
      .typeError("Vui lòng nhập ngày hết hạn thực phẩm")
      .required("Vui lòng nhập ngày hết hạn thực phẩm"),
    confirm_time: yup
      .number("Vui lòng chọn thời gian hủy bỏ")
      .integer("Vui lòng chọn thời gian hủy bỏ")
      .typeError("Vui lòng chọn thời gian hủy bỏ")
      .required("Vui lòng chọn thời gian hủy bỏ"),
    province_id: yup
      .number("Vui lòng chọn Tỉnh/Thành phố")
      .typeError("Vui lòng chọn Tỉnh/Thành phố")
      .required("Vui lòng chọn Tỉnh/Thành phố"),
    district_id: yup
      .number("Vui lòng chọn Huyện/Quận")
      .typeError("Vui lòng chọn Huyện/Quận")
      .required("Vui lòng chọn Huyện/Quận"),
    // ward_id: yup
    //   .number("Vui lòng chọn Xã/Phường")
    //   .typeError("Vui lòng chọn Xã/Phường")
    //   .required("Vui lòng chọn Xã/Phường"),
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
      .required("Vui lòng nhập Thông tin liên hệ")
      .min(10, "Vui lòng nhập thông tin dài hơn")
      .max(100, "Vui lòng nhập thông tin ngắn hơn 100 kí tự"),
    // images_food: yup
    // .array()
    // .min(1, "Vui lòng chọn ít nhất một ảnh")
    // .required("Vui lòng chọn ảnh"),
  });
  const {
    register: donate,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await foodAip.donateFoodApi(data);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        reset();
        setCategory("");
        setTimeConfirm("");
        setProvince("");
        setDistrict("");
        setWard("");
        setSelectedImages([]);
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
        const response = await categoriesApi.getCategories();
        setCategoryList(response);
      } catch (error) {
        console.log("Failed to fetch category list", error);
      }
    })();
  }, []);
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

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const imagesArray = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(imagesArray);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        marginTop={12}
        marginBottom={4}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Paper
          className="col-lg-8 col-md-10 col-12"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          elevation={3}
        >
          <Typography variant="h4" className="p-2 mb-5 mt-2" style={{color:"#ED6C02"}}>
            Trang tặng Thực Phẩm
          </Typography>
          {/* titlel */}
          <TextField
            className="col-lg-10 col-md-10 col-10"
            id="title"
            size="small"
            label="Nhập tiêu đề thực phẩm"
            defaultValue=""
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            {...donate("title")}
          />
          {/* category_id */}
          <FormControl className="col-lg-10 col-md-10 col-10" style={{marginTop: "24px" }}>
            <InputLabel id="category">Chọn danh mục thực phẩm</InputLabel>
            <Select
              id="category_id"
              value={category}
              label="Chọn danh mục thực phẩm"
              error={Boolean(errors.category_id)}
              {...donate("category_id")}
              onChange={handleChange}
            >
              {categoryList.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category_id?.message ? (
              <p className="text-danger">{errors.category_id?.message}</p>
            ) : (
              ""
            )}
          </FormControl>
          {/* description */}
          <TextField
            id="description"
            className="col-lg-10 col-md-10 col-10"
            style={{marginTop: "24px" }}
            label="Mô tả"
            multiline
            rows={4}
            defaultValue=""
            helperText={errors.description?.message}
            error={Boolean(errors.description)}
            {...donate("description")}
          />
          {/* quantity */}
          <TextField
            error={Boolean(errors.quantity)}
            className="col-lg-10 col-md-10 col-10"
            style={{marginTop: "24px" }}
            id="quantity"
            size="small"
            label="Nhập số lượng"
            defaultValue=""
            helperText={errors.quantity?.message}
            {...donate("quantity")}
          />
          {/* expiry_date */}
          <div className="col-lg-10 col-md-10 col-10" style={{marginTop: "24px" }} >
            <label htmlFor="expiry_date" className="col-form-label">
              Thời Gian Hết Hạn
            </label>
            <div
              className={`col-md-12 ${errors.expiry_date ? "has-error" : ""}`}
            >
              <input
                className={`form-control ${
                  errors.expiry_date ? "is-invalid" : ""
                }`}
                name="expiry_date"
                id="expiry_date"
                type="datetime-local"
                defaultValue=""
                {...donate("expiry_date")}
                min={currentDateTime}
              />
              {errors.expiry_date && (
                <div className="invalid-feedback">
                  {errors.expiry_date.message}
                </div>
              )}
            </div>
          </div>
          <div
            className="col-lg-10 col-md-10 col-10"
            style={{ marginTop: "24px" }}
            id="defaultFormControlHelp"
            class="form-text mb-2"
          >
            ex: 30 phút sau khi bạn nhận xác nhận nếu người nhận không đến lấy
            sẽ tự động hủy giao dịch.
          </div>
          {/* confirm_time */}
          <FormControl className="col-lg-10 col-md-10 col-10">
            <InputLabel id="demo-simple-select-label">
              Thời gian hủy bỏ giao dịch
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="confirm_time"
              value={timeConfirm}
              {...donate("confirm_time")}
              error={Boolean(errors.confirm_time)}
              label="Thời gian hủy bỏ giao dịch"
              onChange={handleChangeTimeConfirm}
            >
              <MenuItem value={30}>30 phút</MenuItem>
              <MenuItem value={60}>1 tiếng</MenuItem>
              <MenuItem value={90}>1 tiếng 30 phút</MenuItem>
              <MenuItem value={120}>2 tiếng</MenuItem>
              <MenuItem value={150}>2 tiếng 30 phút</MenuItem>
              <MenuItem value={180}>3 tiếng</MenuItem>
            </Select>
            {errors.confirm_time?.message ? (
              <p className="text-danger">{errors.confirm_time?.message}</p>
            ) : (
              ""
            )}
          </FormControl>

          <FormControl className="col-lg-10 col-md-10 col-10" style={{marginTop: "24px" }}>
            <InputLabel id="label-province">Tỉnh</InputLabel>
            <Select
              labelId="label-province"
              id="province_id"
              value={province}
              label="Tỉnh"
              error={Boolean(errors.province_id)}
              {...donate("province_id")}
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
            <FormControl className="col-lg-10 col-md-10 col-10" style={{marginTop: "24px" }}>
              <InputLabel id="label-district">Huyện</InputLabel>
              <Select
                labelId="label-district"
                id="district_id"
                value={district}
                label="Huyện"
                {...donate("district_id")}
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
            <FormControl className="col-lg-10 col-md-10 col-10" style={{marginTop: "24px" }}>
              <InputLabel id="label-ward">Phường/Xã</InputLabel>
              <Select
                labelId="label-ward"
                id="ward_id"
                value={ward}
                label="Huyện/Xã"
                {...donate("ward_id")}
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
            className="col-lg-10 col-md-10 col-10"
            style={{marginTop: "24px" }}
            id="location"
            size="small"
            label="Nhập địa chỉ cụ thể (số nhà, số đường)"
            defaultValue=""
            helperText={errors.location?.message}
            {...donate("location")}
          />
          <TextField
            className="col-lg-10 col-md-10 col-10"
            error={Boolean(errors.contact_information)}
            style={{marginTop: "24px" }}
            id="contact_information"
            size="small"
            label="Thông tin liên hệ (SDT hoặc Link Mạng xã hội)"
            defaultValue=""
            helperText={errors.contact_information?.message}
            {...donate("contact_information")}
          />
          <Button
            component="label"
            color="warning"
            variant="outlined"
            className="col-lg-10 col-md-10 col-10"
            style={{marginTop: "24px" }}
            startIcon={<CloudUploadIcon />}
          >
            Thêm Hình Ảnh
            <VisuallyHiddenInput
              type="file"
              multiple
              id="images_food"
              {...donate("images_food")}
              onChange={handleFileChange}
            />
          </Button>
          {errors.images_food?.message ? (
            <p className="text-danger">{errors.images_food?.message}</p>
          ) : (
            ""
          )}
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginTop: "8px",
            }}
            className="col-lg-10 col-md-10 col-10"
          >
            {selectedImages.map((image, index) => (
              <ThumbnailImageDetail
                key={index}
                src={image}
                alt={`Selected ${index}`}
              />
            ))}
          </div>
          <Button
            variant="contained"
            color="warning"
            type="submit"
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Tặng Thực Phẩm
          </Button>
        </Paper>
      </Box>
    </form>
  );
}

export default DonateFood;
