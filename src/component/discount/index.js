import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const DiscountScreen = ({
  onClickAmount,
  onClickPercentage,
  screens,
  onClickUpload,
  onClickSelectProduct,
}) => {
  const DiscountTypes = [
    {
      name: "Amount off Products",
      description: "Mark a flat discount off on all selected products",
      done: true,
      onClick: () => onClickAmount && onClickAmount(),
    },
    {
      name: "Percentage off",
      description: "Mark a % age discount off on all selected products",
      done: false,
      onClick: () => onClickPercentage && onClickPercentage(),
    },
    {
      name: "Upload different for each Variant",
      description: "Upload a Sheet with variant level pricing",
      done: true,
      onClick: () => onClickUpload && onClickUpload(),
    },
    {
      name: "Automatic Pricing",
      description: "Set a threshold and our AI does the rest",
      done: "Coming Soon",
      onClick: () => {},
    },
  ];

  return (
    <Container>
      <Box my={4}>
        {screens.map((x, i) => (
          <Typography
            onClick={() => {
              if (x === "Select Products") {
                onClickSelectProduct && onClickSelectProduct();
              } else {
                return {};
              }
            }}
            sx={{ cursor: "pointer" }}
            variant="h7"
            align="left"
          >
            {`${x} ${i === screens?.length - 1 ? "" : " >"}`}
            {/* Select Products &gt; Set Discount */}
          </Typography>
        ))}

        <Typography sx={{ marginTop: 5, fontSize: 18 }}>
          Select Discount Type
        </Typography>
        {DiscountTypes.map((discount, index) => (
          <Box
            onClick={discount.onClick}
            sx={{ marginTop: 2, cursor: "pointer" }}
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            my={2}
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
          >
            <Box>
              <Typography variant="body1">{discount.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {discount.description}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<CheckCircleOutline />}
                  checked={discount.done === true}
                  disabled={discount.done === "Coming Soon"}
                  color="primary"
                />
              }
              label={discount.done === "Coming Soon" ? "Coming Soon" : ""}
            />
          </Box>
        ))}
      </Box>
      <div
        style={{ width: "100%", justifyContent: "flex-end", display: "flex" }}
      >
        <Button
          sx={{ marginRight: 2 }}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => {
            // setSelectionFlowNames("Select Products > Set Discount");
            // setDiscount(true);
          }}
          variant="contained"
          startIcon={<ArrowForwardIcon />}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default DiscountScreen;
