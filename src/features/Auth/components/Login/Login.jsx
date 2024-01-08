import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { unwrapResult } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  login,
  loginFacebook,
  loginGoogle,
  verification,
} from "../../userSlide";
import LoginForm from "./loginForm";
import VerificationForm from "../VerificationForm.jsx/VerificationForm";
Login.propTypes = {
  closeDialog: PropTypes.func,
};
function Login(props) {
  const [verificationForm, setVerificationForm] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();

  const handleClick = (message, severity) => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleLoginGoogle = async (formData) => {
    try {
      const action = loginGoogle(formData);
      const resultAction = await dispatch(action);
      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }
    } catch (errors) {
      console.error("Failed to login:", errors);
    }
  };

  const handleLoginFacebook = async (formData) => {
    try {
      const action = loginFacebook(formData);
      const resultAction = await dispatch(action);
      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }
    } catch (errors) {
      console.error("Failed to login:", errors);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const action = login(formData);
      const resultAction = await dispatch(action);
      if (
        resultAction.payload[0] == "Vui lòng xác thực tài khoản để tiếp tục"
      ) {
        setVerificationForm(true);
        localStorage.setItem("registeredEmail", formData.email);
        enqueueSnackbar(resultAction.payload[0], {
          variant: "success",
        });
      } else if (resultAction.payload[0]) {
        handleClick(resultAction.payload[0], "error");
      } else {
        const user = unwrapResult(resultAction);
        const { closeDialog } = props;
        if (closeDialog) {
          closeDialog();
        }
      }
    } catch (errors) {
      console.error("Failed to login:", errors);
    }
  };

  const handleVerification = async (formData) => {
    try {
      const action = verification(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload[0]) {
        enqueueSnackbar(resultAction.payload, { variant: "error" });
      } else {
        enqueueSnackbar("Xác thực thành công, vui lòng đăng nhập!", {
          variant: "success",
        });
        const { closeDialog } = props;
        if (closeDialog) {
          closeDialog();
        }
      }
    } catch (errors) {
      console.error("Failed to register:", errors);
    }
  };
  return (
    <div>
      {verificationForm ? (
        <VerificationForm onSubmit={handleVerification} />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          handleLoginGoogle={handleLoginGoogle}
          handleLoginFacebook={handleLoginFacebook}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
