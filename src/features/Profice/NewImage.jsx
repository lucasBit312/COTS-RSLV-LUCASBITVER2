import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { baseURL } from "../../constants/env";
import userApi from "../../Api/userApi";
import { enqueueSnackbar } from "notistack";
import NewImage from "./NewImage"; // Make sure to import this component if needed

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function NewImageProfice(userdata) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
  
      const result = await userApi.newImage(formData);
      console.log(result);
  
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      } else if (result.errors) {
        enqueueSnackbar(result.errors[0], { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  console.log(userdata.data);
  return (
    <Grid
      container
      justifyContent="flex-start"
      padding={2}
      style={{ marginTop: "10px" }}
    >
      <Grid marginRight={2} className="">
        {(selectedImage || userdata?.data?.image) && (
          <img
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "1em",
              marginBottom: "10px",
              objectFit: "cover",
            }}
            alt="user"
            src={selectedImage || `${baseURL}${userdata?.data?.image}`}
          />
        )}
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid className="">
          <div className="">
            <Button
              component="label"
              color="warning"
              variant="outlined"
              style={{ marginTop: "10px", padding: "5px" }}
              startIcon={<CloudUploadIcon />}
            >
              Sửa ảnh
              <VisuallyHiddenInput
                type="file"
                multiple
                id="image"
                {...register("image")}
                onChange={handleImageChange}
              />
            </Button>
          </div>
          <div className="pt-2">
            {selectedImage && (
              <Button
                variant="contained"
                color="warning"
                type="submit"
                style={{ padding: "5px" }}
              >
                Cập Nhật
              </Button>
            )}
          </div>
        </Grid>
      </form>
    </Grid>
  );
}

NewImageProfice.propTypes = {
  userdata: PropTypes.object,
};

export default NewImageProfice;
