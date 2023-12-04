import { Box } from "@mui/system";
import PropTypes from "prop-types";
import React from "react";
import FilterByCategory from "./Filter/FilterByCategory";
import FoodSort from "./FilterSort";
import { Grid } from "@mui/material";
import FilterByType from "./Filter/FilterByType";
import MultipleFilter from "./Filter/MultipleFilter";

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
    if (values.province_id) {
      const newFilters = { ...filters, ...values };
      newFilters.district_id = "";
      newFilters.ward_id = "";
      newFilters.district_name = "";
      newFilters.ward_name = "";
      onChange(newFilters);
    } else if (values.district_id) {
      const newFilters = { ...filters, ...values };
      newFilters.ward_id = "";
      newFilters.ward_name = "";
      onChange(newFilters);
    } else {
      const newFilters = { ...filters, ...values };
      onChange(newFilters);
    }
  };
  const onRemove = (values) => {
    console.log("doanifnweig n");
    const newFilters = { ...filters };
    newFilters.province_id = "";
    newFilters.district_id = "";
    newFilters.ward_id = "";
    newFilters.province_name = "";
    newFilters.district_name = "";
    newFilters.ward_name = "";
    newFilters._sort_date = "";
    newFilters.category_id = "";
    newFilters.food_type = "";
    onChange(newFilters);
  };

  return (
    <Box>
      <div
        className="d-flex justify-content-end"
        style={{ paddingLeft: "14px" }}
      >
        {/* <div className="col-lg-3 col-md-6 col-5 pt-2">
          <FilterByCategory onChange={handleCategoryChange} />
        </div> */}
        {/* <div className="col-lg-3 col-md-6 col-5 pt-2">
          <FilterByType onChange={handleTypeChange} />
        </div>
        <div className="col-lg-4 col-md-6 col-12 pt-2">
          <FoodSort
            activeIndex={filters._sort_date}
            onchange={handleSortChange}
          />
        </div> */}
          <MultipleFilter
            filters={filters}
            onChange={handleMultipleFilterChange}
            onRemove={onRemove}
          />
      </div>
    </Box>
  );
}

export default FoodFilter;
