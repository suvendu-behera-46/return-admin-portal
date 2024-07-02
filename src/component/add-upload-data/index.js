import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tooltip,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import {
  CheckCircleOutline,
  Info as InfoIcon,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from 'dayjs';
const AddUploadData = ({
  amount,
  screens,
  percentage,
  onClickDiscount,
  onClickPercentage,
  onClickNext,
  parsedData,
}) => {
  const [allowInternationalOrders, setAllowInternationalOrders] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState("");
  const [continueCampaign, setContinueCampaign] = useState("");

  const disablePastDates = (date) => {
    return date.isBefore(dayjs(), 'day');
  };

  const disableEndDate = (date) => {
    return date.isBefore(startDate, 'day');
  };

  const handleCheckboxChange = (value) => {
    setAllowInternationalOrders(value);
  };

  return (
    <Container>
      <Box my={4}>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" mr={2}>
            Allow for International Orders
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowInternationalOrders === "yes"}
                onChange={() => handleCheckboxChange("yes")}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={allowInternationalOrders === "no"}
                onChange={() => handleCheckboxChange("no")}
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
          shouldDisableDate={disableEndDate}
          renderInput={(params) => <TextField {...params} fullWidth />}
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
            fullWidth
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            variant="outlined"
          />
          <Tooltip title="Total Amount that willl be given as discount set 0 for unlimited budget">
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
                checked={continueCampaign === "yes"}
                onChange={() => setContinueCampaign("yes")}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircleOutline />}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={continueCampaign === "no"}
                onChange={() => setContinueCampaign("no")}
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
            onClick={() => {
              onClickNext &&
                onClickNext({
                  allowInternationalOrders,
                  startDate,
                  endDate,
                  budget,
                  continueCampaign,
                  parsedData,
                });
            }}
            variant="contained"
            startIcon={<ArrowForwardIcon />}
          >
            Next
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default AddUploadData;
