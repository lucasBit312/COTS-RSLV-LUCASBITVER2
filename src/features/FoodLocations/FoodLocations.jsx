import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import food_locations from "../../../src/Api/food_locations";
import FoodLocationList from "./FoodLocationList";
import FoodSkeletonList from "../Foods/components/FoodSkeletonList";
import locationApi from "../../Api/location";
const Paginationcustom = styled("div")({});

const RootBox = styled(Box)({
  backgroundColor: "rgb(247, 247, 247)",
  paddingTop: "32px",
  minHeight: "700px",
});
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ED6C02", 0.15),
  "&:hover": {
    backgroundColor: alpha("#ED6C02", 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "38ch",
      },
    },
  },
}));
function FoodLocations(props) {
  const [foodLocations, setFoodLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const [filtersApplied, setFiltersApplied] = useState(false);

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
    let updatedParams = {};
    switch (key) {
      case "province":
        setProvince(value);
        updatedParams = {
          ...queryParams,
          province_id: value,
        };
        setDistrict("");
        setWard("");
        break;
      case "district":
        setDistrict(value);
        updatedParams = { ...queryParams, district_id: value };
        setWard("");
        break;
      case "ward":
        setWard(value);
        updatedParams = { ...queryParams, ward_id: value };
        break;
      default:
        break;
    }
    const filters = {
      ...updatedParams,
      _page: 1,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort_date: params._sort_date || "ASC",
    };
  }, [location.search]);

  const handlePageChange = (event, newPage) => {
    const filters = {
      ...queryParams,
      _page: newPage,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  const handleSearchChange = (event) => {
    const content = event.target.value;
    const filters = {
      ...queryParams,
      searchContent: content,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };
  useEffect(() => {
    const params = queryString.parse(location.search);
    setProvince(params.province_id || "");
    setDistrict(params.district_id || "");
    setWard(params.ward_id || "");
    const filtersApplied =
      params.province_id || params.district_id || params.ward_id;
    setFiltersApplied(filtersApplied);
  }, [location.search]);

  const removeFilter = (event) => {
    setProvince("");
    setDistrict("");
    setWard("");
    setFiltersApplied(false);

    const filters = {
      _page: 1,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    (async () => {
      try {
        console.log(queryParams);
        const dataRes = await food_locations.getFoodLocations(queryParams);
        const data = dataRes.data;
        setFoodLocations(data);
        setTotalPage(dataRes.last_page);
        setFiltersApplied(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryParams]);

  return (
    <RootBox marginTop={8} style={{ minWidth: "400px" }}>
      <Container>
        <Grid item>
          <Paper elevation={0}>
            <div
              className="row"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}
            >
              <div className="col-lg-12 col-md-6 col-12 ">
                <Typography
                  variant="h4"
                  style={{ paddingLeft: "12px", color: "#ED6C02" }}
                >
                  Trang Địa Điểm Phát Thực Phẩm
                </Typography>
              </div>
            </div>
            {province && filtersApplied ? (
              <div style={{ marginLeft: "24px" }}>
                <Button onClick={removeFilter}>Xóa Bộ Lọc</Button>
              </div>
            ) : null}
            <div
              className="w-100 row space-between"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                marginLeft: "4px",
                paddingRight: "4px",
              }}
            >
              <div className="col-lg-5 col-md-6 col-12 pt-2">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Tìm kiếm..."
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearchChange}
                  />
                </Search>
              </div>
              <div
                className="row col-lg-7 col-md-6 col-12"
                style={{ marginLeft: "1px" }}
              >
                <div className="col-lg-4 col-md-4 col-12">
                  <FormControl
                    fullWidth
                    style={{ marginTop: "10px" }}
                    size="small"
                  >
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
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  {province ? (
                    <FormControl
                      fullWidth
                      style={{ marginTop: "10px" }}
                      size="small"
                    >
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
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  {district ? (
                    <FormControl
                      fullWidth
                      style={{ marginTop: "10px" }}
                      size="small"
                    >
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
                </div>
              </div>
            </div>
            {foodLocations ? (
              loading ? (
                <FoodSkeletonList />
              ) : (
                <FoodLocationList data={foodLocations} />
              )
            ) : (
              <Typography
                style={{ padding: "10px", color: "#ED6C02" }}
                variant="h3"
              >
                Không tìm thấy địa điểm phát thực phẩm
              </Typography>
            )}
            <div
              style={{
                display: "flex",
                flexFlow: "row nowrap",
                justifyContent: "center",
                marginTop: "30px",
                padding: "10px",
              }}
            >
              <Pagination
                container
                justify="center"
                color="warning"
                count={totalPage}
                page={queryParams._page}
                onChange={handlePageChange}
              />
            </div>
          </Paper>
        </Grid>
      </Container>
    </RootBox>
  );
}

export default FoodLocations;
