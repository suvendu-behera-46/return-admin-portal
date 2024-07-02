import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"

const PolicyTable = ({ selectedCampaignData }) => {
  let total =
    selectedCampaignData?.noReturns +
    selectedCampaignData?.exchangeOnly +
    selectedCampaignData?.clearance
  const rows = [
    {
      policySelected: "Easy Returns",
      number: selectedCampaignData?.noReturns,
      share: `${Math.round((selectedCampaignData?.noReturns / total) * 100)}%`,
    },
    {
      policySelected: "Exchange Only",
      number: selectedCampaignData?.exchangeOnly,
      share: `${Math.round((selectedCampaignData?.exchangeOnly / total) * 100)}%`,
    },
    {
      policySelected: "Clearance",
      number: selectedCampaignData?.clearance,
      share: `${Math.round((selectedCampaignData?.clearance / total) * 100)}%`,
    },
  ]

  // Calculate totals
  const totalNumber = rows.reduce((acc, row) => acc + row.number, 0)
  const totalShare = rows.reduce(
    (acc, row) => acc + parseFloat(row.share.replace("$", "")),
    0
  )

  return (
    <TableContainer sx={{ mt: 1 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "600" }}>Policy Selected</TableCell>
            <TableCell sx={{ fontWeight: "600" }}>#</TableCell>
            <TableCell sx={{ fontWeight: "600" }}>Share</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.policySelected}</TableCell>
              <TableCell>{row.number}</TableCell>
              <TableCell>{row.share}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>Total </TableCell>
            <TableCell>{totalNumber}</TableCell>
            <TableCell>${totalShare}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default PolicyTable
