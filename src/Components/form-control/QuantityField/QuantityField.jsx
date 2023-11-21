import React from 'react';
import { TextField, Grid, Button, InputAdornment, IconButton } from '@mui/material';
import { useController } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { Add } from '@mui/icons-material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';
import RedeemIcon from '@mui/icons-material/Redeem';
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
        <Stack direction="row" spacing={2} alignItems="center" className="MuiStack-root" name="quantity">
          <IconButton size="small" onClick={handleDecrement} >
            <RemoveIcon />
          </IconButton>
            <TextField
                type="number"
                size="small"
                error={!!error}
                helperText={error || ''}
                value={value || 1}
                onChange={(e) => onChange(e.target.value)}
                style={{ minWidth:"60px", maxWidth:"70px",  padding: 0, textAlign: 'center', marginLeft:0}}
                className='p-0'
                inputProps={{ readOnly: true }}
            />
          <IconButton size="small" onClick={handleIncrement} style={{marginLeft:0}}>
            <AddIcon />
          </IconButton>
        </Stack>
  );
}

export default QuantityField;
