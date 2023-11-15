import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

FoodSkeletonList.propTypes = {
  length: PropTypes.number,
};

FoodSkeletonList.defaultProps = {
  length: 6,
};

function FoodSkeletonList({ length }) {
  return (
    <Box>
      <Grid container>
        {Array.from({ length }, (_, index) => (
          <Grid item key={index} xs={12} sm={6} lg={3}>
            <Box padding={1}>
              <Skeleton variant="rectangular" width="100%" height={118} />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FoodSkeletonList;