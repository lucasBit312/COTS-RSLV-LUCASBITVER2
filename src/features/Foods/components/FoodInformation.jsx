import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Avatar, Rating, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { unwrapResult } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../../../Constants/env";
import { addToCart } from "../../Cart/CartSlide";
import AddToCartForm from "./AddToCard";
import Switch from "@mui/material/Switch";
import userApi from "../../../Api/userApi";

FoodInformation.propTypes = {
  food: PropTypes.object,
  isSubscribed: PropTypes.bool,
};

function FoodInformation(props) {
  const food = props.food;
  const remaining_time_to_accept = food?.food?.remaining_time_to_accept;
  const loggedInuser = useSelector((state) => state.user.current);
  const isSubscribed = props.isSubscribed;
  const isLoggedIn = !!loggedInuser.id;
  const label = { inputProps: { "aria-label": "sub notification" } };
  const [switchValue, setSwitchValue] = useState(isSubscribed);
  let timeAccept = "";
  if (remaining_time_to_accept) {
    const hours = Math.floor(remaining_time_to_accept / 60);
    const minutes = remaining_time_to_accept % 60;
    if (hours > 0) {
      timeAccept = `${hours} tiếng ${minutes > 0 ? `${minutes} phút` : ""}`;
    } else {
      timeAccept = `${minutes} phút`;
    }
  }
  const ratings = food.food.ratings;
  const ratingValues = Object.values(ratings || {});
  const { totalRating, count } = ratingValues.reduce(
    (accumulator, rating) => {
      if (rating && rating.rating && typeof rating.rating.rating === "number") {
        accumulator.totalRating += rating.rating.rating;
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
        foodId: food?.food?.id,
      };
      const action = addToCart(value);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      }
      if (result.errors) {
        enqueueSnackbar(result.errors[0], { variant: "error" });
      }
    } catch (errors) {
      console.error("Error:", errors);
    }
  };
  const handleChangeSwitch = async (event) => {
    const newValue = event.target.checked;
    const foodId = food?.food?.id;
    setSwitchValue(newValue);
    const data = {
      food_id: foodId,
      new_value: newValue,
    };
    const result = await userApi.notificationSubscribers(data);
  };
  return (
    <Box style={{ marginTop: "24px" }}>
      <Paper elevation={2}>
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
              src={`${baseURL}${food?.food?.user?.image}`}
            />
          </Grid>
          <Grid>
            <Typography color="warning" className="fw-bolder">
              {food?.food?.user?.full_name}
            </Typography>
            <Typography color="warning" className="text-muted">
              Thời Gian:{" "}
              {dayjs(food?.food?.created_at).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography color="warning" className="text-muted">
              {isLoggedIn && (
                <>
                  <Switch
                    {...label}
                    defaultChecked={switchValue}
                    onChange={handleChangeSwitch}
                  />
                  Nhận thông báo
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          padding={1}
        >
          <Grid marginRight={2}>
            <Rating
              name="half-rating-read"
              defaultValue={averageRating ?? 0}
              precision={0.1}
              readOnly
            />
            <Typography className="text-muted" style={{ paddingLeft: "32px" }}>
              {`(${averageRating.toFixed(1)}/5)`}
            </Typography>
          </Grid>
          <Grid>
            <Typography className="text-muted">({count} đánh giá)</Typography>
          </Grid>
          <Grid></Grid>
        </Grid>
        <Grid padding={1}>
          <Typography variant="h4">{food?.food?.title}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>Mô tả: {food?.food?.description}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="text-muted">
            Thời gian hết hạn thực phẩm:{" "}
            {dayjs(food?.food?.expiry_date).format("DD/MM/YYYY HH:mm")}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="text-muted">
            Thời gian cho phép lấy thực phẩm sau khi xác nhận: {timeAccept}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>
            Thông tin liên hệ: {food?.food?.contact_information}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="text-success">
            <AddLocationIcon />
            {food?.food?.location}, {food?.food?.ward}, {food?.food?.district},{" "}
            {food?.food?.province}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="fw-light">
            Số lượng còn: {food?.food?.quantity}{" "}
          </Typography>
        </Grid>
        <Grid style={{ maxWidth: "300px" }}>
          <AddToCartForm onSubmit={handleAddToCartSubmit} />
        </Grid>
      </Paper>
    </Box>
  );
}

export default FoodInformation;
