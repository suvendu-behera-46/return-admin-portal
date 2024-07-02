import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import PolicyTable from "../policy-table";
import dayjs from "dayjs";
import StackedBarChart from "../value-impact-table";

const ValueImpact = () => {
  // State for selected campaign name
  const [campaignName, setCampaignName] = React.useState("");

  // State for start date and end date
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState();
  const disablePastDates = (date) => {
    return date.isBefore(dayjs(), 'day');
  };

  const disableEndDate = (date) => {
    return date.isBefore(startDate, 'day');
  };
  // Handle change function for the dropdown
  const handleChange = (event) => {
    setCampaignName(event.target.value);
  };

  // Sample data for the bar chart
  const data = [
    {
      name: "Page Views",
      value: 500,
    },
    { name: "Engagements", value: 300 },
    { name: "Add to Cart", value: 800 },
    { name: "Reached Checkout", value: 300 },
    { name: "Converted", value: 300 },
  ];

  const tableData = [
    {
      image: "https://picsum.photos/200/300",
      productName: "Product 1",
      pageView: 500,
      conversionRate: "2.5%",
      revenueRetention: "$1500",
      orderedQty: 100,
    },
    {
      image: "https://picsum.photos/200",
      productName: "Product 2",
      pageView: 400,
      conversionRate: "3%",
      revenueRetention: "$1200",
      orderedQty: 80,
    },
    // Add more sample data as needed
  ];

  return (
    <div style={{ paddingBottom: 20, height: "100%" }}>
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        Campaign
      </Typography>

      {/* Date Range Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid sx={{ marginTop: 1 }} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
               shouldDisableDate={disablePastDates}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              shouldDisableDate={disableEndDate}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Typography sx={{ marginTop: 1 }} variant="h5" gutterBottom>
        Value Impact
      </Typography>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Eligible Products</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            235
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearance
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Engagement Rate</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            70%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Revenue Retention</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Conversion Lift</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Engaged User Vs Overall conversion
          </Typography>
        </Box>
      </div>
      <div>
        <StackedBarChart></StackedBarChart>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Eligible Products</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            235
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearance
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Engagement Rate</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            70%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Revenue Retention</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Conversion Lift</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Engaged User Vs Overall conversion
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Eligible Products</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            235
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearance
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Engagement Rate</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            70%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Revenue Retention</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Users selecting Exchange Only or Clearanc
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Conversion Lift</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Engaged User Vs Overall conversion
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            border: "1px solid grey",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Conversion Lift</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }} variant="body2">
            30%
          </Typography>
          <Typography sx={{ fontSize: 10 }} variant="body2">
            Engaged User Vs Overall conversion
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default ValueImpact;
