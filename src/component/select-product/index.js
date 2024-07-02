import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  InputBase,
  IconButton,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductTable from "../product-table";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DiscountScreen from "../discount";
import AmountorPercentageDiscount from "../amount-percentage-off";
import Upload from "../upload";
import UploadConfirm from "../upload-confirm";
import {
  debouncedSearchProductsByName,
  getDistinctCoulmns,
  getDistinctData,
  getProducts,
  searchProductsByName,
} from "@/actions/products";
import { debounce } from "@/lib/debounce";
import {
  getCampaignById,
  updateCampaign,
  updateCampaignProducts,
} from "@/actions/campaignActions";
import { toast } from "react-hot-toast";
const SelectProductScreen = ({
  onClickSaveDraft,
  setRows,
  rows,
  selectedCampaign,
  setSelectProduct,
  setSeletedCampaign,
}) => {
  const [product, setProduct] = React.useState("");
  const [products, setProducts] = useState([]);
  const [showVariable, setShowVariable] = React.useState(false);
  const [productVendor, setProductVendor] = React.useState("");
  const [taggedWith, setTaggedWith] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectionFlowNames, setSelectionFlowNames] = useState("");
  const [productType, setProductType] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState(
    selectedCampaign.productIds || []
  );
  const [discount, setDiscount] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [selectDiscountType, setSelectDiscountType] = useState({
    amount: false,
    percentage: false,
    upload: false,
  });
  const [screens, setScreens] = useState(["Select Products"]);
  const [confirmScreen, setConfirmScreen] = useState(false);
  const [filters, setFilters] = useState({
    tag: "",
    status: "",
    vendor: "",
  });
  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setShowVariable(event.target.checked);
  };

  const handleProductVendorChange = (event) => {
    setFilters({ ...filters, vendor: event.target.value });
  };

  const handleTaggedWithChange = (event) => {
    setFilters({ ...filters, tag: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFilters({ ...filters, status: event.target.value });
  };
  const handleApplyFilter = () => {
    console.log({
      filters,
    });
    // getDistinctData()
  };
  useEffect(() => {
    handleApplyFilter();
  }, [filters]);

  useEffect(() => {
    getDistinctData("vendor").then((e) => setVendors(e));
    getDistinctData("tag").then((e) => setTaggedWith(e));
    getDistinctData("status").then((e) => setStatus(e));
    getDistinctData("productType").then((e) => setProductType(e));
  }, []);
  const searchProduct = debounce(async (name) => {
    const results = await getProducts({ name });
    setProducts(results);
    console.log("Search Results:", results);
    return results;
  }, 300);

  const handleUpdateCampaign = async () => {
    if (!selectedProductIds.length) {
      toast.error("No products selected!");
      return;
    }

    try {
      const campaignId = selectedCampaign?.id; // Ensure this ID is correctly passed to this component
      updateCampaignProducts(campaignId, selectedProductIds)
        .then((e) => {
          setSelectionFlowNames("Select Products > Set Discount");
          setDiscount(true);
          setScreens([...screens, "Set Discount"]);
          setSeletedCampaign(e);
          console.log(e);
        })
        .catch((e) => console.error(e));
      console.log("Campaign updated successfully");
      toast.success("Campaign updated successfully");
      // Optionally navigate to the next screen or show a success message
    } catch (error) {
      console.error("Failed to update campaign", error);
      // Handle errors, for example, by showing an error message
    }
  };
  const updateCampaignType = (data) => {
    updateCampaign(selectedCampaign?.id, data)
      .then((updatedCampaign) => {
        console.log("Campaign updated successfully:", updatedCampaign);
        toast.success("Campaign updated successfully");
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
      });
  };
  useEffect(() => {
    getProducts(filters)
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch(console.error);
  }, [filters]);

  return confirmScreen ? (
    <UploadConfirm
      products={parsedData}
      selectedCampaign={selectedCampaign}
      setSelectProduct={setSelectProduct}
      setConfirmScreen={setConfirmScreen}
      onClickSelectProduct={() => {
        setDiscount(false);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
        setScreens(["Select Products"]);
        setConfirmScreen(false);
      }}
      onClickDiscount={() => {
        setScreens(["Select Products", "Set Discount"]);
        setDiscount(true);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
        setConfirmScreen(false);
      }}
      screens={screens}
    ></UploadConfirm>
  ) : selectDiscountType.upload ? (
    <Upload
      selectedCampaign={selectedCampaign}
      setConfirmScreen={setConfirmScreen}
      parsedData={parsedData}
      setParsedData={setParsedData}
      onClickSelectProduct={() => {
        setDiscount(false);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
        setScreens(["Select Products"]);
      }}
      onClickNext={(e) => {
        setScreens(["Select Products", "Set Discount", "Upload", "Confirm"]);
        setConfirmScreen(true);
        console.log(e, "from select product");
      }}
      onClickDiscount={() => {
        setScreens(["Select Products", "Set Discount"]);
        setDiscount(true);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
      }}
      screens={screens}
    ></Upload>
  ) : selectDiscountType?.amount || selectDiscountType.percentage ? (
    <AmountorPercentageDiscount
      setConfirmScreen={setConfirmScreen}
      selectedCampaign={selectedCampaign}
      onClickSelectProduct={() => {
        setDiscount(false);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
        setScreens(["Select Products"]);
      }}
      onClickDiscount={() => {
        setScreens(["Select Products", "Set Discount"]);
        // setDiscount(true);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
      }}
      screens={screens}
      percentage={selectDiscountType.percentage}
      amount={selectDiscountType.amount}
    ></AmountorPercentageDiscount>
  ) : discount ? (
    <DiscountScreen
      onClickSelectProduct={() => {
        setDiscount(false);
        setSelectDiscountType({
          amount: false,
          percentage: false,
          upload: false,
        });
        setScreens(["Select Products"]);
      }}
      onClickUpload={() => {
        setSelectDiscountType({
          percentage: false,
          amount: false,
          upload: true,
        });
        setScreens([...screens, "Upload"]);
        updateCampaignType({
          campaignType: "UPLOAD",
          budget: 0,
          status: "DRAFT",
          exchangeOnly: 0,
          noReturns: 0,
          clearance: 0,
        });
      }}
      screens={screens}
      onClickPercentage={() => {
        setSelectDiscountType({
          percentage: true,
          amount: false,
          upload: false,
        });
        setScreens([...screens, "Percentage Off"]);
        updateCampaignType({
          campaignType: "PERCENTAGEOFF",
          budget: 0,
          status: "DRAFT",
          exchangeOnly: 0,
          noReturns: 0,
          clearance: 0,
        });
      }}
      onClickAmount={() => {
        setSelectDiscountType({
          percentage: false,
          amount: true,
          upload: false,
        });
        setScreens([...screens, "Set Amount Off"]);
        updateCampaignType({
          campaignType: "AMOUNTOFF",
          budget: 0,
          status: "DRAFT",
          exchangeOnly: 0,
          noReturns: 0,
          clearance: 0,
        });
      }}
    ></DiscountScreen>
  ) : (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Select Product
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <FormControlLabel
          control={
            <Switch checked={showVariable} onChange={handleSwitchChange} />
          }
          label="Show Variable"
          sx={{ ml: "auto" }}
        />
      </Box>
      {showVariable && (
        <Typography variant="body1" align="center" gutterBottom>
          Variable content goes here
        </Typography>
      )}

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "10px",
        }}
      >
        <InputBase
          placeholder="Search..."
          sx={{
            ml: 1,
            flex: 1,
            border: "none",
          }}
          onChange={(e) => searchProduct(e.target.value)}
          inputProps={{ "aria-label": "search" }}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <Divider sx={{ marginBottom: "10px" }} />

      {/* Dropdowns */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Product Vendor</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Product Vendor"
            onChange={handleProductVendorChange}
          >
            {vendors.map((e) => (
              <MenuItem value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Tagged With</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Tagged With"
            onChange={handleTaggedWithChange}
          >
            {taggedWith.map((e) => (
              <MenuItem value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            onChange={handleStatusChange}
          >
            {status.map((e) => (
              <MenuItem value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Product Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Product Type"
            onChange={handleChange}
          >
            {productType.map((e) => (
              <MenuItem value={10}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Collections</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Collections"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl> */}
      </Box>
      <ProductTable
        rows={products}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
      ></ProductTable>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <Typography sx={{ fontSize: 24, marginInline: 5 }} variant="body1">
          {selectedProductIds.length} SKUs Selected
        </Typography>
        <div>
          <Button
            onClick={() => onClickSaveDraft && onClickSaveDraft()}
            sx={{ marginRight: 2 }}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => {
              handleUpdateCampaign(selectedProductIds);
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

export default SelectProductScreen;
