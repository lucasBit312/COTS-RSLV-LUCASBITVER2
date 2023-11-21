import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Avatar, Rating, Typography } from "@mui/material";
import { baseURL } from "../../../constants/env";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddToCartForm from "./AddToCard";
import { addToCart } from "../../Cart/CartSlide";
import { unwrapResult } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';
FoodInformation.propTypes = {
  food: PropTypes.object,
};

function FoodInformation(food) {
    console.log(food);
    const remaining_time_to_accept = food?.food?.food?.remaining_time_to_accept;
    let timeAccept = "";
    if (remaining_time_to_accept) {
      const hours = Math.floor(remaining_time_to_accept / 60);
      const minutes = remaining_time_to_accept % 60;
      if (hours > 0) {
        timeAccept = `${hours} tiếng ${minutes > 0 ? `${minutes} phút` : ''}`;
      } else {
        timeAccept = `${minutes} phút`;
      }
    }
  const ratings = food?.food?.ratings;
  const ratingValues = Object.values(ratings || {});
  const { totalRating, count } = ratingValues.reduce(
    (accumulator, rating) => {
      if (rating && typeof rating === 'object' && 'rating' in rating && typeof rating.rating === 'number') {
        accumulator.totalRating += rating.rating;
        accumulator.count += 1;
      }
      return accumulator;
    },
    { totalRating: 0, count: 0 }
  );
  const averageRating = count > 0 ? totalRating / count : 0;
  

  const dispath = useDispatch();
  const handleAddToCartSubmit = async (formData) => {
    try {
      const value = {
        ...formData,
        foodId: food.food.food.id,
      };
      const action = addToCart(value);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      if (result.success) {
        enqueueSnackbar(result.success, { variant: "success" });
      }
    } catch (errors) {
      console.error("Error:", errors);
    }
  };
  return (
    <Box>
      <Paper elevation={3}>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          padding={2}
        >
          <Grid marginRight={2}>
            <Avatar
              sx={{ width: 56, height: 56 }}
              alt="Avatar"
              src={`${baseURL}${food?.food?.food?.user?.image}`}
            />
          </Grid>
          <Grid>
            <Typography color="warning" className="fw-bolder">
              Tên người Tặng: {food?.food?.food?.user?.full_name}
            </Typography>
            <Typography color="warning" className="text-muted">
              Thời Gian:{" "}
              {dayjs(food?.food?.food?.created_at).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="flex-start" padding={1}>
            <Grid marginRight={2}>
                <Rating name="read-only" value={averageRating ?? 0} readOnly />
            </Grid>
            <Grid>
                <Typography className="text-muted">({count} đánh giá)</Typography>
            </Grid>
        </Grid>
        <Grid padding={1}>
            <Typography>Mô tả: {food?.food?.food?.description}, Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil atque facere eveniet corporis nulla, at repudiandae aliquam vel praesentium, labore natus aspernatur! Praesentium molestiae quod amet suscipit nam, possimus fuga.</Typography>
        </Grid>
        <Grid padding={1}>
            <Typography marginBottom="0" >Thời gian hết hạn: {dayjs(food?.food?.food?.expiry_date).format("DD/MM/YYYY HH:mm")} </Typography>
        </Grid>
        <Grid padding={1}>
            <Typography marginBottom="0" >Thời gian cho phép lấy thực phẩm sau khi xác nhận: {timeAccept} </Typography>
        </Grid>
        <Grid padding={1}>
            <Typography className="text-success"><AddLocationIcon/>{food?.food?.food?.location}, {food?.food?.food?.ward.name}, {food?.food?.food?.district.name}, {food?.food?.food?.province.name} </Typography>
        </Grid>
        <Grid padding={1}>
            <Typography className="fw-light">Số lượng còn: {food?.food?.food?.quantity} </Typography>
        </Grid>
        <Grid style={{maxWidth: "300px"}}>
          <AddToCartForm onSubmit={handleAddToCartSubmit} />
        </Grid>
      </Paper>
    </Box>
  );
}

export default FoodInformation;
