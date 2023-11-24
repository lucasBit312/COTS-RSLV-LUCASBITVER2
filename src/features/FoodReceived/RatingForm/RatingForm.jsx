import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Typography, Rating } from "@mui/material";
import PropTypes from 'prop-types';

Rating.propTypes = {
    closeDialogRating :PropTypes.func,
};
function RatingForm(props) {
    const { closeDialogRating } = props;
    const [point, setPoint] = useState(0);
    const schema = yup.object({
        point: yup.number().positive('Vui lòng đánh giá sao').integer().required('Vui lòng đánh giá'),
        contentRating: yup.string().max(100, 'Vui lòng nhập ít hơn 100 kí tự'),
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

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3">
                <Typography component="legend">Số điểm đánh giá</Typography>
                <div className="text-center p-3">
                    <Controller
                        name="point"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Rating
                                name="simple-controlled"
                                value={point}
                                onChange={(event, newValue) => {
                                    setPoint(newValue);
                                    setValue("point", newValue);
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
