import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import locationApi from "../../../../Api/location";
import categoriesApi from "../../../../Api/categoriesApi";

const MultipleFilter = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [collectType, setCollectType] = useState("0");

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const response = await locationApi.getProvince();
        setProvinceList(response);
      } catch (error) {
        console.log("Failed to fetch province list", error);
      }
    };
    fetchProvinceList();
  }, []);

  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        if (province) {
          const response = await locationApi.getDistricts(province);
          setDistrictList(response);
        }
      } catch (error) {
        console.log("Failed to fetch district list", error);
      }
    };
    fetchDistrictList();
  }, [province]);
  useEffect(() => {
    setDistrict("");
  }, [province]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        if (district) {
          const response = await locationApi.getWards(district);
          setWardList(response);
        }
      } catch (error) {
        console.log("Failed to fetch ward list", error);
      }
    };
    fetchWardList();
  }, [district]);

  useEffect(() => {
    setWard("");
  }, [district]);

  const handleChange = (key, event) => {
    const value = event.target.value;
    let name = "";
    switch (key) {
      case "province":
        setProvince(value);
        name =
          provinceList.find((province) => province.id === value)?.name || "";
        setDistrict("");
        setWard("");
        break;
      case "district":
        setDistrict(value);
        name =
          districtList.find((district) => district.id === value)?.name || "";
        setWard("");
        break;
      case "ward":
        setWard(value);
        name = wardList.find((ward) => ward.id === value)?.name || "";
        break;
      default:
        break;
    }
    if (props.onChange) {
      props.onChange({ [`${key}_id`]: value, [`${key}_name`]: name });
    }
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickType = (event) => {
    const value = event.target.value;
    setCollectType(value);
    if (props.onChange) {
      props.onChange({ collect_type: value });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeFilter = () => {
    setCollectType("");
    setProvince("");
    setDistrict("");
    setWard("");
    setSelectedCategory("");
    setFood_Type("");
    if (props.onRemove) {
      props.onRemove({});
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const response = await categoriesApi.getCategories();
        setCategoryList(response);
      } catch (error) {
        console.log("Failed to fetch category list", error);
      }
    })();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (props.onChange) {
      props.onChange({ category_id: categoryId });
    }
  };

  const [food_type, setFood_Type] = React.useState("");

  const handleTypeChange = (event) => {
    const food_type = event.target.value;
    setFood_Type(food_type);
    if (props.onChange) {
      props.onChange({ food_type: food_type });
    }
  };
  const [_sort_date, setSort_Date] = React.useState("DESC");
  const handleChangeSort = (event, newValue) => {
    setSort_Date(newValue);
    if (props.onChange) {
      props.onChange({ _sort_date: _sort_date });
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        style={{ minWidth: "110px" }}
        color="warning"
        onClick={handleClickOpen}
      >
        <FilterAltIcon /> Bộ Lọc
      </Button>
      <Popover
        style={{ marginTop: "10px" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              minHeight: "280px",
              minWidth: "230px",
            },
          },
        }}
      >
        <div style={{ padding: "16px" }}>
          <FormControl>
            {/* <Typography>Lọc Theo Phương Thức Nhận</Typography>
            <RadioGroup
              aria-labelledby="radio-collect-type"
              value={collectType}
              name="collect_type"
              id="collect_type"
              onChange={handleClickType}
            >
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="2"
                control={<Radio />}
                label="Vận Chuyển Miễn Phí"
              />
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="1"
                control={<Radio />}
                label="Vận Chuyển Có Phí"
              />
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="0"
                control={<Radio />}
                label="Đến Nơi Lấy"
              />
            </RadioGroup> */}
            <Tabs
              value={_sort_date}
              onChange={handleChangeSort}
              aria-label="date sort"
            >
              <Tab
                style={{ color: "#ED6C02" }}
                padding={0}
                value="ASC"
                label="Thực Phẩm Mới Nhất"
                wrapped
              />
              <Tab
                style={{ color: "#ED6C02" }}
                value="DESC"
                label="Thực Phẩm Lâu Nhất"
                wrapped
              />
            </Tabs>
            <div className="pt-2 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel
                  style={{ color: "#ED6C02", minWidth: "260px" }}
                  id="category-select-label"
                >
                  Danh Mục
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  style={{ minWidth: "260px" }}
                  onChange={handleCategoryChange}
                >
                  <MenuItem style={{ color: "#ED6C02" }} value="">
                    Tất Cả
                  </MenuItem>
                  {categoryList.map((category) => (
                    <MenuItem
                      style={{ color: "#ED6C02" }}
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="pt-2 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel
                  style={{ color: "#ED6C02" }}
                  id="category-select-label"
                >
                  Trạng Thái
                </InputLabel>
                <Select
                  labelId="food_type"
                  id="food_type"
                  value={food_type}
                  label="Trạng Thái"
                  onChange={handleTypeChange}
                >
                  <MenuItem style={{ color: "#ED6C02" }} value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={1}>
                    Đã Chế Biến
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={2}>
                    Chưa Chế Biến
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <Typography>Lọc Theo Địa Điểm</Typography>
            <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
              <InputLabel id="label-province">Tỉnh</InputLabel>
              <Select
                labelId="label-province"
                id="province_id"
                value={province}
                label="Tỉnh"
                onChange={(event) => handleChange("province", event)}
              >
                {provinceList.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {province ? (
              <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
                <InputLabel id="label-district">Huyện</InputLabel>
                <Select
                  labelId="label-district"
                  id="district_id"
                  value={district}
                  label="Huyện"
                  onChange={(event) => handleChange("district", event)}
                >
                  {districtList.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            {district ? (
              <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
                <InputLabel id="label-ward">Xã</InputLabel>
                <Select
                  labelId="label-ward"
                  id="ward_id"
                  value={ward}
                  label="Xã"
                  onChange={(event) => handleChange("ward", event)}
                >
                  {wardList.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            <Button
              variant="outlined"
              color="warning"
              className="mt-2"
              onClick={removeFilter}
            >
              Xóa bộ Lọc
            </Button>
          </FormControl>
        </div>
      </Popover>
    </div>
  );
};

MultipleFilter.propTypes = {
  onChange: PropTypes.func,
};

export default MultipleFilter;
