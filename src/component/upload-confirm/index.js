import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  updatePricingTable,
} from "@/actions/campaignActions";
import dayjs from "dayjs";
import { createManyPricings, createPricing } from "@/actions/priceing";
import { generatePricingArray, getProductsByIds } from "@/actions/products";
import { toast } from "react-hot-toast";

const UploadConfirm = ({
  screens,
  onClickNext,
  onClickDiscount,
  onClickSelectProduct,
  selectedCampaign,
  products,
  setSelectProduct,
}) => {
  const [allowInternationalOrders, setAllowInternationalOrders] = useState("");
  const [addData, setAddData] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState({});
  const [paroductsList, setProductsList] = useState(products || []);
  function preparePricingData(campaignData) {
    const {
      productIds,
      exchangeOnly,
      noReturns,
      allowForInternationalOrder,
      id: compainId,
    } = campaignData;

    // Creating an array of pricing objects for each variant ID
    return productIds.map((variantId) => ({
      variantId: variantId,
      shopId: null, // Assume shopId is not provided, set as null or adjust as needed
      exchangeOnlyPrice: exchangeOnly,
      noReturnsPrice: noReturns,
      easyReturnsPrice: null, // Not provided in the input, set as null or adjust as needed
      allowForInternationalOrders: allowForInternationalOrder,
      eligible: true, // Assuming true, adjust based on your criteria
      rank: null, // Rank not provided, set as null or adjust as needed
      compainId: compainId.toString(), // Converting campaign ID to string if not already
    }));
  }

  const handleLiveCampaign = () => {
    console.log({ campaignDetails });
    updatePricingTable(campaignDetails)
      .then((e) => console.log(e))
      .catch((err) => console.error(err));
    updateCampaignStatus(campaignDetails?.id, "LIVE")
      .then((updatedCampaign) => {
        console.log("Campaign updated successfully:", updatedCampaign);
        setSelectProduct(false);
        toast.success("Campaign updated successfully");
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
      });
  };
  const getProducts = (ids) => {
    getProductsByIds(ids).then((e) => {
      console.log(e);
      setProductsList(e);
    });
  };
  useEffect(() => {
    getCampaignById(selectedCampaign?.id).then((e) => {
      console.log(e, "===========");
      getProducts(e.productIds);
      setCampaignDetails(e);
    });
  }, []);

  return (
    <Container>
      <Box my={4}>
        {screens.map((x, i) => (
          <Typography
            key={i}
            onClick={() => {
              if (x === "Set Discount") {
                onClickDiscount && onClickDiscount();
              } else if (x === "Select Products") {
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
          </Typography>
        ))}
      </Box>
      <Box mt={4} p={2} border={1} borderColor="grey.400" borderRadius="4px">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              Total Number of Variants (SKUs)
            </Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              {campaignDetails?.productIds?.length}
            </Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">
              Allow for International Orders
            </Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              {campaignDetails?.allowForInternationalOrder ? "YES" : "NO"}
            </Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">Start Date</Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              {dayjs(campaignDetails?.startDate).format("dddd, MMMM D, YYYY")}
            </Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">End Date</Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              {dayjs(campaignDetails?.startDate).format("dddd, MMMM D, YYYY")}
            </Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">Budget</Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">{campaignDetails?.budget}</Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">
              Continue campaign on price change
            </Typography>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              {campaignDetails?.continueCampaignOnPriceChange ? "YES" : "NO"}
            </Typography>
            <IconButton size="small">
              <EditIcon sx={{ marginLeft: 2 }} fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <div
        style={{
          width: "100%",
          justifyContent: "flex-end",
          display: "flex",
          marginTop: 50,
        }}
      >
        <Button onClick={handleLiveCampaign} variant="contained">
          Confirm
        </Button>
      </div>
    </Container>
  );
};

export default UploadConfirm;
