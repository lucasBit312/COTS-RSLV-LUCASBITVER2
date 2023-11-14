import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@mui/material';
import QuantityField from '../../../Components/form-control/QuantityField/QuantityField';

function AddToCartForm({ onSubmit = null }) {
  const schema = yup.object().shape({
    Quantity: yup
      .number()
      .typeError('Số lượng phải là một số')
      .integer('Số lượng phải là số nguyên')
      .min(1, 'Số lượng nhỏ nhất là 1')
      .required('Vui lòng nhập số lượng'),
  });

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <QuantityField
        name="Quantity"
        label="Quantity"
        control={control}
        error={errors.Quantity?.message}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ minWidth: '240px' }}
        size="large"
      >
        Add To Cart
      </Button>
    </form>
  );
}

export default AddToCartForm;
