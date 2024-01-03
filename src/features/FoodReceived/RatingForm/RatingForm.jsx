import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Typography, Rating } from "@mui/material";
import PropTypes from "prop-types";
import cartApi from "../../../Api/cartApi";
import { enqueueSnackbar } from "notistack";
import ReceivedApi from "../../../Api/ReceivedApi";
Rating.propTypes = {
  closeDialogRating: PropTypes.func,
  received_id: PropTypes.integer,
  setLoadDataRating: PropTypes.func,
};
function RatingForm(props) {
  const { closeDialogRating } = props;
  const { received_id } = props;
  const { setLoadDataRating } = props;
  const [rate, setRate] = useState(0);
  const schema = yup.object({ 
    rate: yup
      .number()
      .positive("Vui lòng đánh giá sao")
      .integer()
      .required("Vui lòng đánh giá"),
    contentRating: yup.string().max(100, "Vui lòng nhập ít hơn 100 kí tự"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await ReceivedApi.rating(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadDataRating();
        if (closeDialogRating) {
          closeDialogRating();
        }
      } else if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-3">
        <Typography component="legend">
          Số điểm đánh giá
        </Typography>
        <input
          type="hidden"
          {...register("transaction_id")}
          value={received_id}
        />
        <div className="text-center p-3">
          <Controller
            name="rate"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <Rating
                name="simple-controlled"
                value={rate}
                onChange={(event, newValue) => {
                  setRate(newValue);
                  setValue("rate", newValue);
                }}
              />
            )}
          />
        </div>
        <textarea
          className="form-control"
          id="contentRating"
          name="contentRating"
          aria-label="With textarea"
          {...register("contentRating")}
        />
        {errors && Object.keys(errors).length > 0 && (
          <p className="text-danger">{Object.values(errors)[0]?.message}</p>
        )}
      </div>
      <div className="text-end">
        <Button type="submit">Đồng Ý</Button>
        <Button onClick={closeDialogRating}>Hủy</Button>
      </div>
    </form>
  );
}

export default RatingForm;
