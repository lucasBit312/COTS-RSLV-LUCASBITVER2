import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React from 'react';
import FilterByCategory from './Filter/FilterByCategory';
import FoodSort from './FilterSort';
import { Grid } from '@mui/material';
import FilterByType from './Filter/FilterByType';
import MultipleFilter from './Filter/MultipleFilter';

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
  const handleTypeChange = (newFoodType) => {
    if (!onChange) return;
    const newFilters = {
      ...filters,
      food_type: newFoodType,
    };
    onChange(newFilters);
  };

  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
  };
  const handleMultipleFilterChange = (values) => {
    if (!onChange) return;
    if(values.province_id){
      const newFilters = { ...filters, ...values };
      newFilters.district_id = '';
      newFilters.ward_id = '';
      newFilters.district_name = '';
      newFilters.ward_name = '';
      onChange(newFilters) 
    } else if(values.district_id){
      const newFilters = { ...filters, ...values };
      newFilters.ward_id = '';
      newFilters.ward_name = '';
      onChange(newFilters);
    }else{
      const newFilters = { ...filters, ...values };
      onChange(newFilters);
    }
  };
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FilterByCategory onChange={handleCategoryChange} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FilterByType onChange={handleTypeChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FoodSort activeIndex={filters._sort_date} onchange={handleSortChange} />
        </Grid>
        <Grid item xs={12} md={2}>
          <MultipleFilter filters={filters} onChange={handleMultipleFilterChange}/>
        </Grid>
      </Grid> 
    </Box>
  );
}

export default FoodFilter;
