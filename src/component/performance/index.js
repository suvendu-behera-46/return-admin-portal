import React, { useEffect, useState } from "react"
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
} from "@mui/material"
import { getEventsGroupedByAction } from "@/actions/event"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"
import PolicyTable from "../policy-table"
import {
  getCampaignById,
  getCampaignsByNameAndId,
} from "../../actions/campaignActions"
import { getEventsByCampaignId } from "../../actions/event"

const PerformanceScreen = () => {
  // State for selected campaign name
  const [campaignName, setCampaignName] = React.useState("")
  const [dashboardEventData, setDashboardEventData] = React.useState([])
  const [allCampaigns, setAllCampaigns] = useState([])
  const [data, setData] = useState([])
  const [selectedCampaignData, setSelectedCampaignData] = useState()
  const transformData = (arr) => {
    return arr.reduce((acc, item) => {
      acc[item.action] = item._count.action
      return acc
    }, {})
  }

  // Handle change function for the dropdown
  const handleChange = async (event) => {
    const selectedId = event.target.value
    setCampaignName(selectedId)
    if (selectedId) {
      try {
        getCampaignById(selectedId)
          .then((e) => setSelectedCampaignData(e))
          .catch((e) => console.error(e))
        // Do something with the response data
      } catch (error) {
        console.error("Error fetching campaign data:", error)
      }
    }
    if (selectedId) {
      try {
        getEventsByCampaignId(selectedId.toString())
          .then((e) => setDashboardEventData(e))
          .catch((e) => console.error(e))
        // Do something with the response data
      } catch (error) {
        console.error("Error fetching campaign data:", error)
      }
    }
  }
  const fetchDashboardData = () => {
    getEventsGroupedByAction()
      .then((e) => setDashboardEventData(e))
      .catch((e) => console.error(e))
  }
  const getAllCampaigns = () => {
    getCampaignsByNameAndId()
      .then((e) => {
        setAllCampaigns(e)
        // setCampaignName(e[0]?.id)
        // handleChange({
        //   target: {
        //     value: e[0]?.id,
        //   },
        // })
      })
      .catch((e) => console.error(e))
  }
  useEffect(() => {
    fetchDashboardData()
    getAllCampaigns()
  }, [])
  useEffect(() => {
    if (dashboardEventData?.length) {
      const result = transformData(dashboardEventData)
      setData([
        {
          name: "Page Views",
          value: result["page-viewed"],
        },
        { name: "Engagements", value: result["widget-clicked"] },
        { name: "Add to Cart", value: result["add-to-cart"] },
        { name: "Reached Checkout", value: result["checkout-started"] },
        { name: "Converted", value: result["checkout-completed"] },
      ])
    }
  }, [dashboardEventData])
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
  ]
  const converTime = (date) => {
    // Original date
    let originalDate = new Date()

    // Set the desired date
    originalDate.setFullYear(2024)
    originalDate.setMonth(4) // Months are zero-based (0 = January, 4 = May)
    originalDate.setDate(5)

    // Format the new date
    let options = { year: "numeric", month: "long", day: "numeric" }
    let formattedDate = originalDate.toLocaleDateString("en-GB", options)
    return formattedDate
  }
  console.log(allCampaigns)
  return (
    <div style={{ paddingBottom: 20, height: "100%" }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Campaign
      </Typography>

      {/* Dropdown with Label in a Row */}
      <Grid container alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="body1">Select Campaign:</Typography>
        </Grid>
        <Grid item xs>
          <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
            <InputLabel id="demo-select-small-label">Campaign</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={campaignName}
              label="Campaign"
              onChange={handleChange}
            >
              {allCampaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.campaignName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {selectedCampaignData ? (
        <></>
      ) : (
        <Typography
          sx={{
            marginLeft: 15,
            marginTop: 30,
            fontWeight: "bold",
            fontSize: 20,
            color: "grey",
          }}
        >
          Please Select a Campaign To See The data
        </Typography>
      )}
      {/* Additional Text after Select */}
      {selectedCampaignData ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">{`Status: ${selectedCampaignData?.status}`}</Typography>
          <Typography sx={{ marginTop: 2 }} variant="body2">
            {`Start Date: ${converTime(selectedCampaignData?.startDate)}`}
          </Typography>
          <Typography sx={{ marginTop: 1 }} variant="body2">
            {`End Date: ${converTime(selectedCampaignData?.endDate)}`}
          </Typography>
          <Typography sx={{ marginTop: 1 }} variant="body2">
            {`Discounts Given: $500/${selectedCampaignData?.budget}`}
          </Typography>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            <Box sx={{ mt: 5 }}>
              <BarChart width={400} height={300} data={data}>
                <CartesianGrid strokeDasharray="5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </Box>

            {/* Additional Text below Bar Chart */}
            <Box sx={{ ml: 30 }}>
              <Typography variant="body2">
                Break Up of Created Orders:
              </Typography>
              <PolicyTable
                selectedCampaignData={selectedCampaignData}
              ></PolicyTable>
            </Box>
          </div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-around",
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
              <Typography variant="body2">
                Conversion Rate (Engaged User)
              </Typography>
              <Typography
                sx={{ fontSize: 20, fontWeight: "bold" }}
                variant="body2"
              >
                1.9%
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
              <Typography variant="body2">
                Conversion Rate For website (PDP to conversion)
              </Typography>
              <Typography
                sx={{ fontSize: 20, fontWeight: "bold" }}
                variant="body2"
              >
                11.20%
              </Typography>
            </Box>
          </div>
        </Box>
      ) : (
        <></>
      )}
      {selectedCampaignData ? (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Page View</TableCell>
                <TableCell>Conversion Rate</TableCell>
                <TableCell>Revenue Retention</TableCell>
                <TableCell>Ordered Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={row.image}
                      alt={row.productName}
                      style={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.pageView}</TableCell>
                  <TableCell>{row.conversionRate}</TableCell>
                  <TableCell>{row.revenueRetention}</TableCell>
                  <TableCell>{row.orderedQty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PerformanceScreen
