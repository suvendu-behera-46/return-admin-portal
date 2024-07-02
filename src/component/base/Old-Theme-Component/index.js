import React from "react";
import { Button, MenuItem, Select, IconButton } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const OldTheme = () => {
  return (
    <div className="theme-container">
      <div className="scrollable-box">
        <p style={{ fontWeight: 500 }}>
          Please select the theme from the dropdown given below to install code
          snippet.
        </p>
        <div className="theme-button-conatiner">
          <Select
            placeholder="Choose"
            size="small"
            style={{ minWidth: 200, marginTop: 5 }}
            defaultValue="Dawn"
          >
            <MenuItem value="theme1">Dawn</MenuItem>
          </Select>
          <Button
            style={{ fontSize: 12, marginTop: 5 }}
            variant="contained"
            className="mui-btn"
            startIcon={<AutorenewIcon />}
          >
            Refresh Theme List
          </Button>
          <Button
            style={{ fontSize: 12, marginTop: 5 }}
            variant="contained"
            className="mui-btn"
          >
            Install Code in selected theme
          </Button>
        </div>
        <p
          style={{ fontSize: 12, padding: 10, fontWeight: 500, marginTop: 20 }}
        >
          If the theme has custom codes and the one click install did not work
          then would need to install code manually.
        </p>
        <p
          style={{
            fontSize: 12,
            padding: 10,
            fontWeight: 500,
          }}
        >
          {`To add the button , copy the code given below and paste below the {{product.title}} code`}
        </p>
        <p
          style={{ fontSize: 12, padding: 10, fontWeight: 500, marginLeft: 10 }}
        >
          {`{% render 'ZooomyListWishlistProduct'%}`}
        </p>
        <p
          style={{
            fontSize: 12,
            padding: 10,
            fontWeight: 500,
          }}
        >
          {`You can change the position of code as per your requirements`}
        </p>
        <img
          style={{
            height: "40%",
            width: "40%",
            marginLeft: "20%",
            marginTop: 10,
          }}
          alt="image"
          src="/image.jpeg"
        ></img>
      </div>
    </div>
  );
};

export default OldTheme;
