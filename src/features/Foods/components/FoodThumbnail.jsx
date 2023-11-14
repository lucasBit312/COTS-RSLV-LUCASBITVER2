import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { baseURL } from '../../../constants/env';

FoodThumbnail.propTypes = {
    food: PropTypes.object,
};

function FoodThumbnail(food) {
    console.log(food)
    return (
        <Box>
            <img src={`${baseURL}${food.food.image_url}`} alt={food.food.title} style={{ borderRadius: '5px' }}  width="100%" height="444" />
        </Box>
    );
}

export default FoodThumbnail;