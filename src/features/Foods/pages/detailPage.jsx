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
import foodAip from '../../../Api/foodApi';
import { createAsyncThunk } from '@reduxjs/toolkit';

DetailPage.propTypes = {
    
};

function DetailPage(props) {
   const dispath = useDispatch();
   const {
        params:{foodId},
        url
    } = useRouteMatch();

    const {food, loading} = useFoodDetail(foodId);


    // const handleAddToCartSubmit = async (formValues) =>{
    //     console.log('Form submit', formValues);
    //     const action = addToCart({
    //         id: food.id,
    //         food,
    //         quantity: formValues.Quantity,
    //     });

    //     console.log(action)
    //     dispath(action);
    // }
    const handleAddToCartSubmit = createAsyncThunk(
      async (formValues) => {
        try {
          const response = await foodAip.addToCartAPI(food.id, formValues.quantity);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
    )
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