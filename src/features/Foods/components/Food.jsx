import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import { baseURL } from '../../../constants/env';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const FoodContainer = styled(Box)({
  position: 'relative',
  cursor: 'pointer',
  border: '1px solid #efefef',
  borderRadius: '0.5em',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(0.9)', 
    boxShadow: '1px 1px 1px #ed6c02', 
    borderRadius: "0.5em",
  },
});


FoodContainer.propTypes = {
  food: PropTypes.object,
};

function Food({ food }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/foods/${food.id}`);
  };

  return (
    <FoodContainer margin={1.5} onClick={handleClick}>
      <Box padding={1}>
        <img
          style={{ borderRadius: '5px',objectFit: 'cover' }}
          src={`${baseURL}${food.image_url}`}
          alt={food.title}
          width="100%"
          height="222"
        />
      </Box>
      <Typography padding={1} variant="body2">{food.title}</Typography>
      <Typography padding={1} variant="body1">{food.user_id}</Typography>
    </FoodContainer>
  );
}

export default Food;
