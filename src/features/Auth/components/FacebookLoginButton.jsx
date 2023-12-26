import React from "react";
import FacebookLogin from "react-facebook-login";

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
      fields="name,email,picture"
      callback={responseFacebook}
    />
  );
}

export default FacebookLoginButton;
