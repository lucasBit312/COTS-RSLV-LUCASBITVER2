import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

footer.propTypes = {
    
};

function footer(props) {
    return (
        <Box paddingTop={3} style={{backgroundColor:"#ED6C02"}}>
            <Typography style={{ minHeight:"100px"}}>Đây là footer</Typography>
        </Box>
    );
}

export default footer;