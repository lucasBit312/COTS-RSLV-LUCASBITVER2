import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import RegisterForm from '../RegisterForm/RegisterForm';
import userApi from '../../../../Api/userApi';
import { login, register } from '../../userSlide';
import { useDispatch } from 'react-redux';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoginForm from '../LoginForm/loginForm';

function Login(props) {
    Login.propTypes = {
    closeDialog: PropTypes.func,
  };  

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', 
  });

  const handleClick = (message, severity) => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity,
    });
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  const dispatch = useDispatch();
  const handleLogin = async (formData) => {
    try {
      const action = login(formData);
      const resultAction = await dispatch(action);
      if(resultAction.payload[0]){
        handleClick(resultAction.payload[0], 'error');
      }else{
        const user = unwrapResult(resultAction);
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
      <LoginForm onSubmit={handleLogin} />
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleClose}
      >
        <Alert 
          onClose={handleClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
