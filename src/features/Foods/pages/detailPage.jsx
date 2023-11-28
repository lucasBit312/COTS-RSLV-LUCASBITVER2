import { Box, Container, Grid, LinearProgress, Typography } from "@mui/material";
import React from "react";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";
import FoodInformation from "../components/FoodInformation";
import FoodThumbnail from "../components/FoodThumbnail";
import useFoodDetail from "../hooks/useFoodDetail";
import DetailPageRating from "../components/DetailPageRating";

DetailPage.propTypes = {};

function DetailPage(props) {
  const {
    params: { foodId },
    url,
  } = useRouteMatch();

  const { food, loading } = useFoodDetail(foodId);
  if (loading) {
    return (
      <Box  marginTop={9} sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <Container>
      <Box marginTop={12} style={{minHeight: '700px'}}>
        <Typography variant="h3"> Chi tiết Thực Phẩm</Typography>
        <Grid container marginBottom={2} spacing={2}>
          <Grid item xs={12} md={6}>
            <FoodThumbnail food={food} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FoodInformation food={food} />
          </Grid>
        </Grid>
        <Grid container marginBottom={4} spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <DetailPageRating ratings ={food.ratings}/>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailPage;
