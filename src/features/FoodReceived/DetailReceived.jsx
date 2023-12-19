import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";
import transactionsApi from "../../Api/transaction";
import { useState } from "react";
import FoodThumbnail from "../Foods/components/FoodThumbnail";
import FoodInfomationReceived from "./FoodInfomationReceived";
import DetailPageRating from "../Foods/components/DetailPageRating";
import FoodThumbnailReceived from "./FoodThumbnailReceived";
DetailReceived.propTypes = {};

function DetailReceived(props) {
  const { match } = props;
  const transactionId = match.params.foodId;
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [food, setFood] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataRes = await transactionsApi.detailTransaction(transactionId);
        setTransaction(dataRes.transaction);
        setFood(dataRes.food);
        setRatings(dataRes.ratings);
        setLoading(false);
        console.log(dataRes);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
        <div style={{ minHeight: "700px" }}></div>
      </Box>
    );
  }
  return (
    <Container>
      <Box marginTop={12} style={{ minHeight: "700px" }}>
        <Typography variant="h4">Chi tiết Thực Phẩm Nhận</Typography>
        <Grid container marginBottom={2} spacing={2}>
          <Grid item xs={12} md={6}>
            <FoodThumbnailReceived food={food} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FoodInfomationReceived food={food} ratings={ratings} transaction={transaction} />
          </Grid>
        </Grid>
        <Grid container marginBottom={4} spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <DetailPageRating ratings={ratings} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailReceived;
