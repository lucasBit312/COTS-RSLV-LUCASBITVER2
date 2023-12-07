import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { baseURL } from "../../constants/env";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userApi from "../../Api/userApi";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { styled } from "@mui/styles";
import NewImageProfice from "./NewImage";
import Address from "./Address";
import Password from "./Password";
import ProficeSkeleton from "../../Components/Skeleton/ProficeSkeleton";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Profice(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setActiveIndex(newValue);
  };
  const schema = yup.object({
    full_name: yup
      .string()
      .required("Vui lòng nhập họ và tên")
      .max(100, "Vui lòng nhập ít hơn 100 kí tự")
      .min(5, "Vui lòng nhập dài hơn 5 kí tự"),
    birthdate: yup
      .date("Vui lòng nhập ngày sinh")
      .typeError("Vui lòng nhập ngày sinh hợp lệ")
      .required("Vui lòng nhập ngày sinh hợp lệ"),

    phone_number: yup
      .string()
      .matches(/^[0-9]+$/, "Vui lòng chỉ nhập số")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại"),
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
      const result = await userApi.editProfice(data);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
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
        const response = await userApi.getProfice();
        setUser(response.user);
      } catch (error) {
        console.log("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ProficeSkeleton />;
  }
  return (
    <Box
      marginTop={14}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper className="col-lg-6 col-md-8 col-12 " elevation={3}>
        <Typography className="p-3 fs-2" style={{ color: "#ED6C02" }}>
          Thông Tin Cá Nhân
        </Typography>
        <Tabs value={activeIndex} onChange={handleChange} aria-label="profice">
          <Tab style={{ color: "#ED6C02" }} label="Tài Khoản" />
          <Tab style={{ color: "#ED6C02" }} label="Địa Chỉ" />
          <Tab style={{ color: "#ED6C02" }} label="Mật Khẩu" />
        </Tabs>

        <TabPanel value={activeIndex} index={0}>
          <NewImageProfice data={user} />
          <Typography className="fw-semibold">Thông tin chi tiết</Typography>
          <hr style={{ marginTop: "3px" }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              style={{ width: "100%" }}
              id="title"
              size="small"
              label="Họ và Tên"
              defaultValue={user.full_name}
              error={Boolean(errors.full_name)}
              helperText={errors.full_name?.message}
              {...Profice("full_name")}
            />
            <div class="mb-3" style={{ width: "100%", marginTop: "20px" }}>
              <label htmlFor="birthdate" className="col-form-label">
                Ngày Sinh
              </label>
              <div className={`col-md-12 `}>
                <input
                  className={`form-control ${
                    errors.birthdate ? "is-invalid" : ""
                  }`}
                  name="birthdate"
                  id="birthdate"
                  type="datetime-local"
                  defaultValue={
                    user.birthdate
                      ? new Date(user.birthdate).toISOString().slice(0, 16)
                      : ""
                  }
                  {...Profice("birthdate")}
                />
                {errors.birthdate && (
                  <div className="invalid-feedback">
                    {errors.birthdate.message}
                  </div>
                )}
              </div>
            </div>
            <TextField
              style={{ width: "100%", marginTop: "20px" }}
              id="title"
              size="small"
              label="Email"
              defaultValue={user ? user.email : ""}
              disabled
            />
            <TextField
              style={{ width: "100%", marginTop: "35px" }}
              id="title"
              size="small"
              label="Số Điện Thoại"
              defaultValue={user.phone_number}
              error={Boolean(errors.phone_number)}
              helperText={errors.phone_number?.message}
              {...Profice("phone_number")}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              Cập Nhật Thông Tin
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={activeIndex} index={1}>
          <Address user={user}></Address>
        </TabPanel>
        <TabPanel value={activeIndex} index={2}>
          <Password user={user}></Password>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Profice;
