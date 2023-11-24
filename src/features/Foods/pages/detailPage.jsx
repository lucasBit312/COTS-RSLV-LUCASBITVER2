import { Box, Container, Grid, LinearProgress } from "@mui/material";
import React from "react";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";
import FoodInformation from "../components/FoodInformation";
import FoodThumbnail from "../components/FoodThumbnail";
import useFoodDetail from "../hooks/useFoodDetail";

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
      <Box marginTop={9} style={{minHeight: '700px'}}>
        <Grid container marginBottom={4} spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FoodThumbnail food={food} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} md={12}>
              <FoodInformation food={food} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailPage;
