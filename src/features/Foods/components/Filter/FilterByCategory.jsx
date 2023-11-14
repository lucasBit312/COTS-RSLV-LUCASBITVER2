import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import categoriesApi from '../../../../Api/categoriesApi';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

FilterByCategory.propTypes = {
  onChange: PropTypes.func,
};
function FilterByCategory({ onChange }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const response = await categoriesApi.getCategories();
        setCategoryList(response);
      } catch (error) {
        console.log('Failed to fetch category list', error);
      }
    })();
  }, []);
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (onChange) {
      onChange(categoryId);
    }
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 220, marginTop:3, marginLeft:2}} size="small">
      <InputLabel id="category-select-label">Danh Mục</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory}
        label="Category"
        onChange={handleCategoryChange}
      >
        <MenuItem value="all">
          <em>Tất Cả</em>
        </MenuItem>
        {categoryList.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FilterByCategory;
