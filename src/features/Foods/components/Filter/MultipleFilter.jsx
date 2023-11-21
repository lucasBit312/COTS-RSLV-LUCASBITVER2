import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
  Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import locationApi from '../../../../Api/location';

const MultipleFilter = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [collectType, setCollectType] = useState('0');

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const response = await locationApi.getProvince();
        setProvinceList(response);
      } catch (error) {
        console.log('Failed to fetch province list', error);
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
        console.log('Failed to fetch district list', error);
      }
    };
    fetchDistrictList();
  }, [province]);
  useEffect(() => {
    setDistrict('');
  }, [province]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        if (district) {
          const response = await locationApi.getWards(district);
          setWardList(response);
        }
      } catch (error) {
        console.log('Failed to fetch ward list', error);
      }
    };
    fetchWardList();
  }, [district]);

  useEffect(() => {
    setWard('');
  }, [district]);

  const handleChange = (key, event) => {
    const value = event.target.value;
    let name = '';
    switch (key) {
      case 'province':
        setProvince(value);
        name = provinceList.find((province) => province.id === value)?.name || '';
        setDistrict('');
        setWard('');
        break;
      case 'district':
        setDistrict(value);
        name = districtList.find((district) => district.id === value)?.name || '';
        setWard('')
        break;
      case 'ward':
        setWard(value);
        name = wardList.find((ward) => ward.id === value)?.name || '';
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
    console.log("food:Dsad",value)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeFilter = () => {
    setCollectType('');
    setProvince('');
    setDistrict('');
    setWard('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button style={{ marginLeft: '16px' }} variant="outlined" color="warning" onClick={handleClickOpen}>
        <FilterAltIcon /> Bộ Lọc
      </Button>
      <Popover
        style={{ marginTop: '10px' }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            style: {
              minHeight: '300px',
              minWidth: '200px',
            },
          },
        }}
      >
        <div style={{ padding: '16px' }}>
          <FormControl>
            <Typography>Lọc Theo Phương Thức Nhận</Typography>
            <RadioGroup
              aria-labelledby="radio-collect-type"
              value={collectType}
              name="collect_type"
              id="collect_type"
              onChange={handleClickType}
            >
              <FormControlLabel value="2" control={<Radio />} label="Vận Chuyển Miễn Phí" />
              <FormControlLabel value="1" control={<Radio />} label="Vận Chuyển Có Phí" />
              <FormControlLabel value="0" control={<Radio />} label="Đến Nơi Lấy" />
            </RadioGroup>
            <Typography>Lọc Theo Địa Điểm</Typography>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <InputLabel id="label-province">Tỉnh</InputLabel>
              <Select
                labelId="label-province"
                id="province_id"
                value={province}
                label="Tỉnh"
                onChange={(event) => handleChange('province', event)}
              >
                {provinceList.map((province) => (
                 <MenuItem key={province.id} value={province.id}>
                  {province.name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
            {province ? (
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <InputLabel id="label-district">Huyện</InputLabel>
                <Select
                  labelId="label-district"
                  id="district_id"
                  value={district}
                  label="Huyện"
                  onChange={(event) => handleChange('district', event)}
                >
                  {districtList.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ''
            )}
            {district ? (
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <InputLabel id="label-ward">Xã</InputLabel>
                <Select
                  labelId="label-ward"
                  id="ward_id"
                  value={ward}
                  label="Xã"
                  onChange={(event) => handleChange('ward', event)}
                >
                  {wardList.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id} >
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ''
            )}
            <Button variant="outlined" color="warning" className="mt-2" onClick={removeFilter}>
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
