import React from "react";
import FacebookLogin from "react-facebook-login";
import FacebookIcon from "@mui/icons-material/Facebook";
import "../../components/css/styleBtnFacebook.css";
function FacebookLoginButton({ onSubmitFacebook }) {
  const responseFacebook = (response) => {
    try {
      console.log("Facebook response:", response);
      onSubmitFacebook(response);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <FacebookLogin
      appId="2573804676112638"
      autoLoad={false}
      size="small"
      cssClass="btnFacebook"
      icon={<FacebookIcon />}
      textButton=""
      fields="name,email,picture"
      callback={responseFacebook}
    />
  );
}

export default FacebookLoginButton;
