import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import foodAip from '../../../Api/foodApi';
import  queryString from 'query-string';
import FoodSkeletonList from '../components/FoodSkeletonList';
import FoodList from '../components/FoodList';
import FoodSort from '../components/FilterSort';
import FilterByCategory from '../components/Filter/FilterByCategory';
import FoodFilter from '../components/FoodFilter';

const Pagination = styled('div')({
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    marginTop: '40px',
});
const RootBox = styled(Box)({
    backgroundColor: 'rgb(247, 247, 247)',
    paddingTop: '32px'
});


function ListPage(props) {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPage, setTotalPage] = useState(0);
    const history = useHistory();
    const location = useLocation();
    const queryParams = useMemo(() => {
      const params =  queryString.parse(location.search);
      return {
        ...params, 
        _page: Number.parseInt(params._page)|| 1,
        _sort_date: params._sort_date || 'ASC',
      };
    },[location.search])
    const handleFiltersChange = (newFilters) => {
      const filters ={
        ...queryParams,
        ...newFilters,
      };
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters)
      });
    };
    const setNewFilters = (newFilters) => {
    history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(newFilters)
    });
    }
    useEffect(() => {
        (async () => {
          try {
            console.log(queryParams);
            const dataRes = await foodAip.getAll(queryParams);
            const data = dataRes.data
            if (data.length > 0) {
              setFoods(data);
              setTotalPage(dataRes.last_page);
            } else{
                setFoods(null)
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        })();
      }, [queryParams]);
    return (
        <RootBox marginTop={8}>
            <Container>
              <Grid item>
                  <Paper elevation={0}>
                  <FoodFilter filters={queryParams} onChange={handleFiltersChange}/>
                  {foods ? loading ? <FoodSkeletonList /> : <FoodList data={foods} /> : <Typography style={{ padding: '10px' }} variant='h3'>Không tìm thấy sản phẩm</Typography> }
                  </Paper>
              </Grid>
            </Container>
        </RootBox>
    );
}

export default ListPage;
