import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom';
import useFoodDetail from '../hooks/useFoodDetail';
import FoodThumbnail from '../components/FoodThumbnail';
import QuantityField from '../../../Components/form-control/QuantityField/QuantityField';
import AddToCartForm from '../components/AddToCard';
import { addToCart } from '../../Cart/CartSlide';

DetailPage.propTypes = {
    
};

function DetailPage(props) {
  const dispatch = useDispatch();
  const { params: { foodId }, url } = useRouteMatch();
  const { food, loading } = useFoodDetail(foodId);

  const handleAddToCartSubmit = (formValues) => {
      dispatch(addToCart(food.id, formValues.Quantity));
  };
    return (
    <Container>
        <Box marginTop={8}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
                <FoodThumbnail food={food} />
            </Grid>
            <Grid item xs={12} md={8}>
               <AddToCartForm  onSubmit={handleAddToCartSubmit}/>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
}

export default DetailPage;