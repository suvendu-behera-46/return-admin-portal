import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Tooltip,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  CheckCircleOutline,
  Info as InfoIcon,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { updateCampaign } from "@/actions/campaignActions";
import dayjs from "dayjs";

const AmountorPercentageDiscount = ({
  amount,
  screens,
  percentage,
  onClickDiscount,
  onClickSelectProduct,
  selectedCampaign,
  setConfirmScreen,
}) => {
  console.log("AmountorPercentageDiscount");
  const [allowInternationalOrders, setAllowInternationalOrders] =
    useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(null);
  const [continueCampaign, setContinueCampaign] = useState(false);
  const [exchangeOnly, setExchangeOnly] = useState(null);
  const [noReturns, setNoReturns] = useState(null);

  const handleCheckboxChange = (value) => {
    setAllowInternationalOrders(value);
  };

  const disablePastDates = (date) => {
    return date.isBefore(dayjs(), "day");
  };

  const disableEndDate = (date) => {
    return date.isBefore(startDate, "day");
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
      campaignType: amount ? "AMOUNTOFF" : "PERCENTAGEOFF",
      status: selectedCampaign.status,
      shopId: selectedCampaign.shopId,
      products: selectedCampaign.campaignProducts.map((product) => {
        const basePrice = product.product.variantPrice;
        const discountexchangeOnly = parseFloat(exchangeOnly);
        const discountnoReturns = parseFloat(noReturns);

        let exchangeOnlyPrice;
        let finalSalePrice;
        if (amount) {
          exchangeOnlyPrice = basePrice - discountexchangeOnly;
          finalSalePrice = basePrice - discountnoReturns;
        } else {
          exchangeOnlyPrice =
            basePrice - (basePrice * discountexchangeOnly) / 100;
          finalSalePrice = basePrice - (basePrice * discountnoReturns) / 100;
        }

        return {
          variantId: product.variantId,
          exchangeOnlyPrice: parseFloat(exchangeOnlyPrice.toFixed(2)),
          finalSalePrice: parseFloat(finalSalePrice.toFixed(2)),
          easyReturnsPrice: parseFloat(basePrice),
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
              }
            }}
            sx={{ cursor: "pointer" }}
            variant="h7"
            align="left"
          >
            {`${x} ${i === screens?.length - 1 ? "" : " >"}`}
          </Typography>
        ))}
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1">
            {amount ? "Amount Off" : "Percent off"}
          </Typography>
          <Tooltip
            title={
              amount
                ? "We will accept till two decimal points, enter 4.11 if you want $4.11 off"
                : "We will accept uptil 2 decimal points, enter 21.11 if you want 21.11% off the product"
            }
          >
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flexDirection: "column", display: "flex" }} mt={2}>
          <TextField
            sx={{ maxWidth: 400 }}
            type="number"
            size="small"
            fullWidth
            label="Exchange only"
            variant="outlined"
            margin="normal"
            value={exchangeOnly}
            onChange={(e) => setExchangeOnly(e.target.value)}
          />
          <TextField
            sx={{ maxWidth: 400 }}
            size="small"
            type="number"
            fullWidth
            label={amount ? "No returns" : "Clearance"}
            variant="outlined"
            margin="normal"
            value={noReturns}
            onChange={(e) => setNoReturns(e.target.value)}
          />
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" mr={2}>
            Allow for International Orders
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowInternationalOrders}
                onChange={() => handleCheckboxChange(true)}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!allowInternationalOrders}
                onChange={() => handleCheckboxChange(false)}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="No"
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box alignItems="center" display="flex" flexDirection="row" mt={2}>
            <Typography variant="body1" mb={1}>
              Start Date
            </Typography>
            <DatePicker
              sx={{ maxWidth: 400, marginLeft: 3 }}
              size="small"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              shouldDisableDate={disablePastDates}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          <Box alignItems="center" display="flex" flexDirection="row" mt={2}>
            <Typography variant="body1" mb={1}>
              End Date
            </Typography>
            <DatePicker
              sx={{ maxWidth: 400, marginLeft: 3 }}
              size="small"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              shouldDisableDate={disableEndDate}
            />
          </Box>
        </LocalizationProvider>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" mr={2}>
            Budget
          </Typography>
          <TextField
            sx={{ maxWidth: 400, marginLeft: 3 }}
            size="small"
            type="number"
            fullWidth
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            variant="outlined"
          />
          <Tooltip title="Total Amount that will be given as discount set 0 for unlimited budget">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" mr={2}>
            Continue campaign on price change
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={continueCampaign}
                onChange={() => setContinueCampaign(true)}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!continueCampaign}
                onChange={() => setContinueCampaign(false)}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="No"
          />
          <Tooltip title="If you select no and the price changes of the product the campaign will stop for that product">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={4}>
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
      </Box>
    </Container>
  );
};

export default AmountorPercentageDiscount;
