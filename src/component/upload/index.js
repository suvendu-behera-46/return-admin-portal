import React, { useState } from "react";
import { Box, Typography, Container, IconButton, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddUploadData from "../add-upload-data";
import axios from "axios";
import { updateCampaign } from "@/actions/campaignActions";
import dayjs from "dayjs";

const Upload = ({
  screens,
  onClickNext,
  onClickDiscount,
  onClickSelectProduct,
  parsedData,
  setParsedData,
  selectedCampaign,
  setConfirmScreen,
}) => {
  const [allowInternationalOrders, setAllowInternationalOrders] =
    useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(null);
  const [continueCampaign, setContinueCampaign] = useState(false);
  const [exchangeOnly, setExchangeOnly] = useState(null);
  const [noReturns, setNoReturns] = useState(null);
  const [addData, setAddData] = useState(false);

  const handleCheckboxChange = (value) => {
    setAllowInternationalOrders(value);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/uploadProducts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Uploaded data:", response.data);
      setParsedData(response.data.products);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileDownload = () => {
    axios
      .post(
        "/api/exportProducts",
        { productIds: selectedCampaign?.productIds },
        { responseType: "blob" }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  const handleClickNext = () => {
    console.log(selectedCampaign);
    const payload = {
      campaignName: selectedCampaign.campaignName,
      rank: selectedCampaign.rank,
      allowForInternationalOrder: allowInternationalOrders,
      startDate: startDate ? dayjs(startDate).toISOString() : null,
      endDate: endDate ? dayjs(endDate).toISOString() : null,
      budget: budget ? parseInt(budget) : null,
      continueCampaignOnPriceChange: continueCampaign,
      campaignType: "UPLOAD",
      status: selectedCampaign.status,
      shopId: selectedCampaign.shopId,
      products: parsedData.map((product) => {
        const basePrice = product.variantPrice;
        const discountexchangeOnly = parseFloat(product.exchangeOnly);
        const discountnoReturns = parseFloat(product.noReturns);

        const exchangeOnlyPrice =
          basePrice - (basePrice * discountexchangeOnly) / 100;
        const finalSalePrice =
          basePrice - (basePrice * discountnoReturns) / 100;

        return {
          variantId: product.variantId,
          exchangeOnlyPrice: parseFloat(exchangeOnlyPrice.toFixed(2)),
          finalSalePrice: parseFloat(finalSalePrice.toFixed(2)),
          easyReturnsPrice: parseFloat(basePrice.toFixed(2)),
        };
      }),
    };

    updateCampaignHandler(payload);
  };

  const updateCampaignHandler = (data) => {
    updateCampaign(selectedCampaign?.id, data)
      .then((updatedCampaign) => {
        console.log("Campaign updated successfully:", updatedCampaign);
        setConfirmScreen(true);
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
      });
  };

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
      {addData ? (
        <AddUploadData
          parsedData={parsedData}
          onClickNext={onClickNext}
        ></AddUploadData>
      ) : (
        <React.Fragment>
          <Box
            mt={4}
            p={2}
            border={1}
            borderColor="grey.400"
            borderRadius="4px"
          >
            <Typography variant="body1">Steps to update the price:</Typography>
            <Typography variant="body2">
              1. Download the file, it will have all the products and variants
            </Typography>
            <Typography variant="body2">
              2. Two columns named Exchange only and No Returns will be empty
            </Typography>
            <Typography variant="body2">
              3. Add your pricing only in the two columns, we will accept only
              up to two decimal points
            </Typography>
            <Typography variant="body2">
              4. Prices will be in store currency
            </Typography>
            <Typography variant="body2">
              Please reach out to support if you feel you need help.
            </Typography>
          </Box>
          <Box mt={2} display="flex" alignItems="center">
            <Typography sx={{ minWidth: 200 }} variant="body1">
              Download List of all Variants in this campaign
            </Typography>
            <IconButton onClick={handleFileDownload}>
              <CloudDownloadIcon
                sx={{ width: 100, height: 70, marginLeft: 5 }}
              />
            </IconButton>
          </Box>
          <Box mt={2} display="flex" alignItems="center">
            <Typography sx={{ minWidth: 200 }} variant="body1">
              Upload file back
            </Typography>
            <input
              type="file"
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileUpload}
            />
            <IconButton
              onClick={() => document.getElementById("file-upload").click()}
            >
              <CloudUploadIcon sx={{ width: 100, height: 70, marginLeft: 5 }} />
            </IconButton>
          </Box>
          {parsedData && (
            <Box mt={4}>
              <Typography variant="h6">Parsed Data:</Typography>
              <pre>{JSON.stringify(parsedData, null, 2)}</pre>
            </Box>
          )}
        </React.Fragment>
      )}

      {addData ? (
        <></>
      ) : (
        <div
          style={{
            width: "100%",
            justifyContent: "flex-end",
            display: "flex",
            marginTop: 50,
          }}
        >
          <Button
            sx={{ marginRight: 2 }}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Draft
          </Button>
          <Button
            onClick={handleClickNext}
            variant="contained"
            startIcon={<ArrowForwardIcon />}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Upload;
