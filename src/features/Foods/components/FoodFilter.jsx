import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React from 'react';
import FilterByCategory from './Filter/FilterByCategory';
import FoodSort from './FilterSort';
import { Grid } from '@mui/material';

FoodFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

function FoodFilter({ filters, onChange }) {
  const handleSortChange = (newSortValue) => {
    const newFilters = {
      ...filters,
      _sort_date: newSortValue,
    };
    onChange(newFilters);
  };

  const handleCategoryChange = (newCategoryId) => {
    if (!onChange) return;
    const newFilters = {
      ...filters,
      category_id: newCategoryId,
    };
    onChange(newFilters);
  };

  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <FilterByCategory onChange={handleCategoryChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FoodSort activeIndex={filters._sort_date} onchange={handleSortChange} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default FoodFilter;
