import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SensorsIcon from "@mui/icons-material/Sensors";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import SelectProductScreen from "../select-product";
import { getProducts } from "@/actions/products";
import { toast } from "react-hot-toast";
import {
  createCampaign,
  getAllCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from "@/actions/campaignActions";
import { getAllEvents, getEventsGroupedByAction } from "@/actions/event";
import { useSession } from "next-auth/react";
function isTodayBetweenDates(campaign) {
  const today = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  // Check if today is between the start and end dates
  return today >= startDate && today <= endDate;
}
const Campaigns = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectProduct, setSelectProduct] = useState(false);
  const [selectedLiveCampaign, setSelectedLiveCampaign] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [selectedPause, setSelectedPause] = useState(false);
  const [markCompleteWhilePause, setMarkCompleteWhilePause] = useState(false);
  const [restartCampainModal, setRestartCampainModal] = useState(false);
  const [completeStatus, setCompleteStatus] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [selectedCampaign, setSeletedCampaign] = useState({});
  const [rank, setRank] = useState(0);
  const [rows, setRows] = useState([]);

  const cellStyles = {
    border: "1px solid #dddddd",
  };

  const renderStatus = (status) => {
    let icon;
    let color;

    switch (status) {
      case "LIVE":
        icon = <SensorsIcon color="success" />;
        color = "green";
        break;
      case "DRAFT":
        icon = <EditIcon color="action" />;
        color = "gray";
        break;
      case "PAUSED":
        icon = <PauseCircleIcon color="warning" />;
        color = "orange";
        break;
      case "COMPLETE":
        icon = <DoneAllIcon color="primary" />;
        color = "blue";
        break;
      default:
        icon = null;
        color = "black";
    }

    return (
      <Box display="flex" alignItems="center" color={color}>
        {icon}
        <Typography variant="body2" sx={{ marginLeft: 1 }}>
          {status}
        </Typography>
      </Box>
    );
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClosemarkCompleteModal = () => setMarkCompleteWhilePause(false);
  const handleCloseRestartCampaign = () => setRestartCampainModal(false);
  const handleCheckboxChange = (rowData) => {
    const updatedRows = rows.map((row) =>
      row.rank === rowData.rank ? { ...row, select: !row.select } : row
    );
    setRows(updatedRows);
    setSeletedCampaign(rowData);
    const clickedRow = updatedRows.find((row) => row.rank === rowData.rank);
    if (clickedRow.status === "LIVE") {
      setSelectedLiveCampaign(clickedRow.select ? rowData : null);
      setSelectedPause(false);
      setCompleteStatus(false);
    } else if (clickedRow.status === "PAUSED") {
      setSelectedLiveCampaign(null);
      setSelectedPause(true);
      setCompleteStatus(false);
    } else if (clickedRow.status === "COMPLETE") {
      setCompleteStatus(true);
      setSelectedPause(false);
      setSelectedLiveCampaign(null);
    } else if (clickedRow.status === "DRAFT") {
      setSelectedPause(false);
      setCompleteStatus(false);
    }
  };
  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);
  const handleCloseCloneModal = () => setShowCloneModal(false);
  const togglepusemodal = () => setPauseModalOpen((e) => !e);
  const handlePauseModalClose = () => setPauseModalOpen(false);

  const handleReStart = () => {
    if (!isTodayBetweenDates(selectedCampaign)) return;
    handleCampaignStatusChange("LIVE");
  };
  const handleCreateCampaign = () => {
    console.log(campaignName, parseInt(rank), session);
    createCampaign({
      campaignName: campaignName,
      rank: parseInt(rank),
      shopId: session?.user?.shopID,
      status: "DRAFT",
    })
      .then((e) => {
        toast.success("Campaign Createded Successfully.");
        handleClose();
        setSeletedCampaign(e);
        setSelectProduct(true);
        console.log(e);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const handleClickStatus = (e) => {
    console.log(e);
    if (e.status == "DRAFT") {
      setSeletedCampaign(e);
      setSelectProduct(true);
    }
  };
  const handleCampaignStatusChange = (status) => {
    console.log(status);
    updateCampaignStatus(selectedCampaign.id, status)
      .then((updatedCampaign) => {
        console.log("Campaign updated successfully:", updatedCampaign);
        toast.success("Campaign updated successfully");
        setPauseModalOpen(false);
        handleConfirmModalClose();
        fetchCampaign();
        setSeletedCampaign({});
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
      });
  };
  const handleClickMarkAsCompelete = () => {
    handleCampaignStatusChange("COMPLETE");
  };
  const fetchCampaign = () => {
    getAllCampaigns()
      .then((e) => setRows(e))
      .catch((e) => console.error(e));
  };
  useEffect(() => {
    if (!selectProduct) {
      fetchCampaign();
    }
  }, [selectProduct]);

  return selectProduct ? (
    <SelectProductScreen
      selectedCampaign={selectedCampaign}
      setSeletedCampaign={setSeletedCampaign}
      setSelectProduct={setSelectProduct}
      onClickSaveDraft={() => {
        setSelectProduct(false);
        setStarted(false);
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "90%",
      }}
    >
      <Toolbar>
        <Typography variant="h6">Pricing Rule</Typography>
      </Toolbar>
      <Container
        sx={{ backgroundColor: "#FFF", minWidth: "100%", width: "100%" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <FormControlLabel
            control={<Switch />}
            label="Hide Completed"
            labelPlacement="end"
          />
          <Box>
            {completeStatus ? (
              <Button
                onClick={() => setShowCloneModal(true)}
                variant="contained"
                color="primary"
                sx={{ margin: 1 }}
              >
                Clone and Restart
              </Button>
            ) : (
              <></>
            )}
            {/* {selectedPause ? (
              <>
                <Button
                  onClick={() => setMarkCompleteWhilePause(true)}
                  variant="contained"
                  color="primary"
                  sx={{ margin: 1 }}
                >
                  Mark Complete
                </Button>

                <Button
                  onClick={() => handleClickRestart}
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="primary"
                >
                  Re-start
                </Button>
              </>
            ) : (
              <></>
            )} */}
            {selectedCampaign?.id && (
              <>
                {selectedCampaign.status !== "DRAFT" &&
                  selectedCampaign.status !== "COMPLETE" && (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ margin: 1 }}
                      onClick={handleConfirmModalOpen}
                    >
                      Mark Complete
                    </Button>
                  )}

                {selectedCampaign.status === "PAUSED" && (
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleReStart()}
                  >
                    Re-start
                  </Button>
                )}
                {selectedCampaign.status === "LIVE" && (
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={togglepusemodal}
                  >
                    Pause
                  </Button>
                )}
              </>
            )}
            <Button variant="contained" color="primary" sx={{ margin: 1 }}>
              Re order Campaign
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Create New Campaign
            </Button>
          </Box>
        </Box>
        <Table
          size="small"
          sx={{ minWidth: 600 }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Rank
              </TableCell>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Select
              </TableCell>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Campaign Name
              </TableCell>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Status
              </TableCell>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Discount
              </TableCell>
              <TableCell style={{ fontWeight: 600 }} align="left">
                Results
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
              >
                <TableCell component="th" scope="row" align="left">
                  {row.rank}
                </TableCell>
                <TableCell align="left">
                  <Checkbox
                    checked={row.id == selectedCampaign.id}
                    onChange={() => handleCheckboxChange(row)}
                  />
                </TableCell>
                <TableCell align="left">{row.campaignName}</TableCell>
                <TableCell align="left">
                  <span onClick={() => handleClickStatus(row)}>
                    {renderStatus(row.status)}
                  </span>
                </TableCell>
                <TableCell align="left">{row.discount}</TableCell>
                <TableCell align="left">
                  <LogoutIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        {started ? (
          <DialogContent style={{ padding: "30px", textAlign: "left" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                htmlFor="campaignName"
                style={{ marginRight: "8px", width: 150 }}
              >
                Campaign Name:
              </label>
              <TextField
                size="small"
                id="campaignName"
                fullWidth
                variant="outlined"
                style={{ flex: 1, marginRight: "8px" }}
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
              <Tooltip
                sx={{ bgcolor: "#ffcc80" }}
                title="Set up a unique name so you can identify it later (cannot be changed later)"
              >
                <InputAdornment position="end">
                  <InfoIcon color="action" />
                </InputAdornment>
              </Tooltip>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <label htmlFor="rank" style={{ marginRight: "8px", width: 150 }}>
                Rank:
              </label>
              <TextField
                size="small"
                id="rank"
                type="number"
                fullWidth
                variant="outlined"
                style={{ flex: 1, marginRight: "8px" }}
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
              <Tooltip
                sx={{ bgcolor: "#ffcc80" }}
                title="Set priority in case the same product lands in two campaigns (can be changed later)"
              >
                <InputAdornment position="end">
                  <InfoIcon color="action" />
                </InputAdornment>
              </Tooltip>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                style={{
                  marginTop: "4px",
                  minWidth: 70,
                }}
                onClick={handleCreateCampaign}
              >
                Next
              </Button>
            </div>
          </DialogContent>
        ) : (
          <>
            <DialogTitle style={{ textAlign: "center", minWidth: 300 }}>
              How does it work ?
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent style={{ padding: "30px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#3f51b5",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    1
                  </div>
                  <span>Enter Campaign Name and Rank</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#3f51b5",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    2
                  </div>
                  <span style={{ marginTop: 5 }}>
                    {`Select Products (you can use tags/vendor/category/search or upload)`}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#3f51b5",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    3
                  </div>
                  <span>
                    Enter Discount %, Start and End Date and Budget limit
                  </span>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                sx={{ margin: 1 }}
                onClick={() => setStarted(true)}
                color="primary"
                variant="contained"
              >
                Lets Get Started
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog open={confirmModalOpen} onClose={handleConfirmModalClose}>
        <DialogContent style={{ padding: "20px", textAlign: "center" }}>
          <IconButton
            onClick={handleConfirmModalClose}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ padding: 2 }} variant="body1">
            Are you sure you want to mark this campaign as completed? This will
            stop the campaign and is not reversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }} style={{ justifyContent: "center" }}>
          <Button onClick={handleClickMarkAsCompelete} variant="contained">
            Mark Complete
          </Button>
          <Button
            onClick={() => handleCampaignStatusChange("PAUSED")}
            variant="contained"
            color="primary"
          >
            Only Pause
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={pauseModalOpen} onClose={handlePauseModalClose}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            Pause Campaign
            <IconButton onClick={handlePauseModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to pause this campaign? This will only pause
            the campaign; the product will not show any discounts/option.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={() => handleCampaignStatusChange("PAUSED")}
            variant="contained"
            color="primary"
          >
            Pause
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={markCompleteWhilePause}
        onClose={handleClosemarkCompleteModal}
      >
        <DialogContent style={{ padding: "20px", textAlign: "center" }}>
          <IconButton
            onClick={handleClosemarkCompleteModal}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ padding: 2 }} variant="body1">
            Are you sure you want to mark this campaign as completed? This will
            stop the campaign and is not reversible
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }} style={{ justifyContent: "center" }}>
          <Button variant="contained">Mark Complete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={restartCampainModal} onClose={handleCloseRestartCampaign}>
        <DialogContent style={{ padding: "20px", textAlign: "center" }}>
          <IconButton
            onClick={handleCloseRestartCampaign}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ padding: 2 }} variant="body1">
            Are you sure you want to restart this campaign? This will restart
            the campaign from the same point will stop as per the constraints
            entered
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }} style={{ justifyContent: "center" }}>
          <Button variant="contained">Restart Campaign</Button>
          <Button variant="contained" color="primary">
            Edit Campaign
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showCloneModal} onClose={handleCloseCloneModal}>
        <DialogContent style={{ padding: "50px", textAlign: "center" }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <TextField
                size="small"
                label="Enter Campaign Name"
                variant="outlined"
                fullWidth
              />
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <TextField
                size="small"
                label="Rank"
                variant="outlined"
                fullWidth
              />
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }} style={{ justifyContent: "center" }}>
          <Button variant="contained">Next</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Campaigns;
