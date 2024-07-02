import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
function areAllElementsPresent(firstArray, secondArray) {
  for (let element of firstArray) {
    if (!secondArray.includes(element)) {
      return false;
    }
  }
  return true;
}

function Row({ row, selectedProductIds, setSelectedProductIds }) {
  const [open, setOpen] = React.useState(false);
  const isSelected = areAllElementsPresent(
    row.variants.map((e) => e.variantId),
    selectedProductIds
  );

  function handleSelect(idArr) {
    console.log("Current selectedProductIds:", selectedProductIds);
    const updatedSelection = [...selectedProductIds];

    idArr.forEach((id) => {
      const index = updatedSelection.indexOf(id);
      if (index === -1) {
        // ID is not currently selected, so add it
        updatedSelection.push(id);
      } else {
        // ID is currently selected, so remove it
        updatedSelection.splice(index, 1);
      }
    });

    setSelectedProductIds(updatedSelection);
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Checkbox
            checked={isSelected} // Assuming the productId can be used to check selection
            onChange={() => handleSelect(row.variants.map((e) => e.variantId))}
          />
        </TableCell>
        <TableCell>
          <img
            style={{ height: 50, width: 50 }}
            alt="product image"
            src={row.img}
          ></img>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.variantName}
        </TableCell>
        <TableCell>{row.inventory}</TableCell>
        <TableCell>{row.price}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Variants
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
                      Inventory
                    </TableCell>
                    <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProductIds.includes(
                            variant.variantId
                          )}
                          onChange={() => handleSelect([variant.variantId])}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {variant.name}
                      </TableCell>
                      <TableCell>{variant.inventoryAvailableQty}</TableCell>
                      <TableCell>{variant.variantPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ProductTable({
  rows,
  selectedProductIds,
  setSelectedProductIds,
}) {
  return (
    <TableContainer
      sx={{
        maxHeight: 400,
        backgroundColor: "#F7FBFD",
        minWidth: "100%",
      }}
      component={Paper}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
              Image
            </TableCell>
            <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
              Product Name
            </TableCell>
            <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
              Inventory
            </TableCell>
            <TableCell sx={{ fontSize: 17, fontWeight: "bold" }}>
              Price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              setSelectedProductIds={setSelectedProductIds}
              selectedProductIds={selectedProductIds}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
