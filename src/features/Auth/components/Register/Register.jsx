import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import RegisterForm from '../RegisterForm/RegisterForm';
import userApi from '../../../../Api/userApi';
import { register } from '../../userSlide';
import { useDispatch } from 'react-redux';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { enqueueSnackbar } from 'notistack';

function Register(props) {
  Register.propTypes = {
    closeDialog: PropTypes.func,
  };  

  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const dispatch = useDispatch();
  const handleRegister = async (formData) => {
    try {
      const action = register(formData);
      const resultAction = await dispatch(action);
      console.log(resultAction)
      if(resultAction.payload[0]){
        enqueueSnackbar(resultAction.payload[0], { variant:'error' });
      }else{
        const user = unwrapResult(resultAction);
        enqueueSnackbar('Đăng kí thành công, vui lòng đăng nhập để tiếp tục', { variant:'success' });
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
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}

export default Register;
