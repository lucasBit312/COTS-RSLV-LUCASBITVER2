import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import userApi from "../../Api/userApi";
import addressApi from "../../Api/address";

Password.propTypes = {
  user: PropTypes.object,
};

function Password(props) {
  const schema = yup.object({
    old_password: yup.string().required("Vui lòng nhập mật khẩu cũ"),
    password: yup
      .string()
      .required("Vui lòng nhập")
      .min(6, "Mật khẩu phải dài hơn 6 kí tự")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "Mật khẩu phải chứa ít nhất một kí tự đặc biệt, một chữ cái và một chữ số A-Za-zd@$!%*#?"
      ),
    re_password: yup
      .string()
      .required("Vui lòng nhập")
      .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
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
      const result = await userApi.newPassword(data);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
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
  return (
    <Box marginBottom={4} minHeight={400}>
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <hr style={{ marginTop: "3px" }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            type="password"
            id="old_password"
            size="small"
            label="Mật khẩu cũ"
            error={Boolean(errors.old_password)}
            helperText={errors.old_password?.message}
            {...Profice("old_password")}
          />

          <TextField
            style={{ width: "100%", marginTop: "20px" }}
            type="password"
            id="password"
            size="small"
            label="Mật khẩu mới"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...Profice("password")}
          />

          <TextField
            style={{ width: "100%", marginTop: "20px" }}
            type="password"
            id="re_password"
            size="small"
            label="Nhập lại mật khẩu mới"
            error={Boolean(errors.re_password)}
            helperText={errors.re_password?.message}
            {...Profice("re_password")}
          />
          <Button
            variant="contained"
            color="warning"
            type="submit"
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Thay đổi mật khẩu
          </Button>
        </form>
      </div>
    </Box>
  );
}

export default Password;
