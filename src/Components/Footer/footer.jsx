import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

footer.propTypes = {
    
};

function footer(props) {
    return (
        <Box paddingTop={3}  className="d-flex justify-content-center" style={{backgroundColor:"#ED6C02"}}>
            <Typography style={{ minHeight:"100px"}}>Demo Footer</Typography>
        </Box>
    );
}

export default footer;