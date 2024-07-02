"use client";
import TransitionsModal from "@/component/base/Modal";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
// import BannerForm from "@/components/forms/Banner";
import { useSnackbar } from "@/hooks/useSnakBar";
import useWindowSize from "@/hooks/useWindowSize";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TextField, InputAdornment } from "@mui/material";
import { RowingTwoTone, Search as SearchIcon } from "@mui/icons-material";
import TablePagination from "@mui/material/TablePagination";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddUserDialog from "@/component/base/Add-User-Component";
import styles from "./Account.module.scss";
import axios from "axios";
import { debounce } from "lodash";
export default function Account() {
  const [open, setOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleCloseDialog = () => setOpenDialog(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Owner");
  const size = useWindowSize();
  const [searchValue, setSearchValue] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.userRole);
    setOpenDialog(true);
  };
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `/api/team?limit=${rowsPerPage}&offset=${page * rowsPerPage}`
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  useEffect(() => {
    fetchTeamMembers();
  }, [rowsPerPage, page]);
  const updateTeamMember = async () => {
    try {
      const response = await axios.put(`/api/team/`, {
        id: selectedUser?.id,
        userRole: selectedRole,
      });
      console.log("Team member updated:", response.data);
      handleCloseDialog();
      fetchTeamMembers();
      openSnackbar("success", "Team member updated successfully");
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };
  // Handler for updating the search value
  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);
    // const { value } = event.target;
    // console.log(value);
    // debouncedSearch(value);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  const debouncedSearch = debounce(async (term) => {
    try {
      const response = await axios.post(`/api/team/search`, { email: term });
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, 500); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

  return (
    <div
      style={{
        // maxHeight: "50vh",
        // border: "1px solid red",
        width: "100%",
        // minHeight: "100vh",
        height: "90%",
      }}
    >
      <div
        style={{
          // position: "sticky",
          // top: 90,
          padding: "10px",
          // border: "1px solid blue",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 5,
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Team Members
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            sx={{ paddingInline: 5, minWidth: "30vw" }}
            placeholder="Search by email"
            // label="Search"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TransitionsModal
            formName={true ? "Edit " : "Add "}
            handleClose={handleCloseModal}
            openButton={
              <Button
                onClick={() => setShowAddUserModal(true)}
                style={{
                  background: "blue",
                  color: "white",
                }}
              >
                + Add Members
              </Button>
            }
            open={open}
            setOpen={(e) => setOpen(e)}
          ></TransitionsModal>
        </div>
      </div>
      <TableContainer
        component={Paper}
        className={styles.tableContainer}
        sx={{
          width: "100%",
          maxHeight: size.height - 200,
          boxShadow: "none",
          // border: "1px solid red",
        }}
      >
        <div className={styles.mobileCard}>
          {teamMembers?.map((row, i) => (
            <Card key={i} style={{ marginBottom: 10, marginTop: 5 }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {row.name}
                  </Typography>
                  <div onClick={() => handleOpenDialog(row)}>
                    <MoreVertIcon style={{ cursor: "pointer" }} />
                  </div>
                </div>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Email: s{row.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Last Active:{row.lastSeen}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Role: {row.userRole}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={styles.webTable}>
          <Table
            size="small"
            sx={{ minWidth: 600 }}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }} align="left">
                  Name
                </TableCell>
                <TableCell style={{ fontWeight: 600 }} align="left">
                  Email
                </TableCell>
                <TableCell style={{ fontWeight: 600 }} align="left">
                  Last Active
                </TableCell>
                <TableCell style={{ fontWeight: 600 }} align="left">
                  Role
                </TableCell>
                <TableCell style={{ fontWeight: 600 }} align="left">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamMembers?.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.lastSeen}</TableCell>
                  <TableCell align="left">{row.userRole}</TableCell>
                  <TableCell align="left">
                    <ButtonBase
                      style={{
                        marginRight: 10,
                        padding: "5px 10px",
                        borderRadius: 10,
                      }}
                      onClick={() => handleOpenDialog(row)}
                    >
                      <MoreVertIcon />
                    </ButtonBase>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            component="div"
            count={6} // Total number of rows
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      </TableContainer>
      {
        <div className={styles.mobilePagination}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            component="div"
            count={6} // Total number of rows
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      }
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Member</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <div className="input-filed-conatiner">
          <div style={{ display: "flex", alignItems: "center", width: "80%" }}>
            <Typography
              variant="subtitle1"
              style={{ marginRight: "10px", width: 70 }}
            >
              Name:
            </Typography>{" "}
            {/* Title for Name */}
            <Typography variant="subtitle1" style={{ maxWidth: 200 }}>
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "80%" }}>
            <Typography
              variant="subtitle1"
              style={{ marginRight: "10px", width: 70 }}
            >
              Email:
            </Typography>{" "}
            {/* Title for Email */}
            <Typography variant="subtitle1" style={{ maxWidth: 200 }}>
              {selectedUser.email}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "80%",
              marginTop: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ marginRight: "10px", width: 90 }}
            >
              Role:
            </Typography>{" "}
            {/* Title for Role */}
            <Select
              placeholder="Role"
              size="small"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              variant="outlined"
              fullWidth
            >
              {/* owner,administrator,analyst,read-only */}
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="administrator">Administrator</MenuItem>
              <MenuItem value="analyst">Analyst</MenuItem>
              <MenuItem value="read-only">Read Only</MenuItem>
            </Select>
          </div>
        </div>
        <DialogContent></DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={updateTeamMember}
          >
            Save Update
          </Button>

          <div className="button-container" style={{ marginLeft: 0 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCloseDialog}
            >
              Resend Invite
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseDialog}
            >
              Delete Account
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleCloseDialog}
            >
              Reset Password
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <AddUserDialog
        handleClose={() => setShowAddUserModal(false)}
        fetchTeamMembers={fetchTeamMembers}
        open={showAddUserModal}
      ></AddUserDialog>
    </div>
  );
}
