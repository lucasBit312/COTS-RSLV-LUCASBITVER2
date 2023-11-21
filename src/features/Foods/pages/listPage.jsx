import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import foodAip from '../../../Api/foodApi';
import  queryString from 'query-string';
import FoodSkeletonList from '../components/FoodSkeletonList';
import FoodList from '../components/FoodList';
import FoodSort from '../components/FilterSort';
import Pagination from '@mui/material/Pagination';
import FoodFilter from '../components/FoodFilter';
import FilterViewer from '../components/Filter/FilterView';
import Button from '@mui/material/Button';

const Paginationcustom = styled('div')({
   
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
    const handlePageChange = (event, newPage) => {
      const filters ={
        ...queryParams,
        _page: newPage,
      };
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters)
      });
    };
    function removeEmptyStrings(obj) {
      const newObj = { ...obj };
      for (const key in newObj) {
        if (newObj[key] === '') {
          delete newObj[key];
        }
      }
      return newObj;
    }
    const handleFiltersChange = (newFilters) => {
      const filters = removeEmptyStrings({
        ...queryParams,
        ...newFilters,
      });
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters)
      });
    };
    
    const setNewFilters = (newFilters) => {
    const filters = removeEmptyStrings(newFilters);
    history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters)
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

      console.log(totalPage)
    return (
        <RootBox marginTop={8} style={{minWidth:"400px"}}>
            <Container>
              <Grid item>
                  <Paper elevation={0}>
                    <FoodFilter filters={queryParams} onChange={handleFiltersChange}/>
                    <Grid item>
                      <FilterViewer filters={queryParams} onChange={setNewFilters}/>
                    </Grid>
                    {foods ? loading ? <FoodSkeletonList /> : <FoodList data={foods} /> : <Typography style={{ padding: '10px' }} variant='h3'>Không tìm thấy sản phẩm</Typography> }
                    <div style={{ display: 'flex',
                      flexFlow: 'row nowrap',
                      justifyContent: 'center',
                      marginTop: '30px',
                      padding: '10px'}}>
                      <Pagination
                        container justify="center"
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

export default ListPage;
