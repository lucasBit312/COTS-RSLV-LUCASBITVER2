import React from 'react';
import { TextField, Grid, Button, InputAdornment } from '@mui/material';
import { useController } from 'react-hook-form';

function QuantityField({ name, control, label, error }) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  const handleIncrement = () => {
    onChange(Number(value) + 1);
  };

  const handleDecrement = () => {
    if(value>1){
     onChange(Number(value) - 1);
    }
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Button variant="outlined" onClick={handleDecrement}>
          -
        </Button>
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          variant="outlined"
          fullWidth
          size="small"
          label={label}
          error={!!error}
          helperText={error || ''}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={handleIncrement}>
          +
        </Button>
      </Grid>
    </Grid>
  );
}

export default QuantityField;
