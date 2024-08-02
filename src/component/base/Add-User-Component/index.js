import CloseIcon from "@mui/icons-material/Close"
import InfoIcon from "@mui/icons-material/Info"
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import axios from "axios"
import React from "react"

const initialUserData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
}

const AddUserDialog = ({ open, handleClose, fetchTeamMembers }) => {
  const [userData, setUserData] = React.useState(initialUserData)
  const [passwordError, setPasswordError] = React.useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleRoleChange = (e) => {
    const { value, checked } = e.target
    setUserData((prevData) => ({
      ...prevData,
      role: checked ? value : "",
    }))
  }

  const validatePassword = () => {
    const { password, confirmPassword } = userData
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,25}$/
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8 to 25 characters long and contain at least one uppercase and one lowercase letter."
      )
      return false
    }
    if (password !== confirmPassword) {
      setPasswordError("Password doesn't match")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleAddUser = async () => {
    try {
      if (validatePassword()) {
        // Add logic to handle adding user data (e.g., API call)
        const payload = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          userRole: userData.role,
          shopID: 1, // Updated to match new schema
          password: userData.password,
          shopUserID: "001", // Updated to match new schema
        }
        const response = await axios.post("/api/team", payload)
        console.log("Team member added:", response.data)
        console.log("User data:", payload)
        setUserData(initialUserData)
        handleClose()
        fetchTeamMembers()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Add User
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sx={{ marginTop: 2 }} item xs={6}>
            <TextField
              size="small"
              variant="outlined"
              name="firstName"
              label="First Name"
              value={userData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid sx={{ marginTop: 2 }} item xs={6}>
            <TextField
              size="small"
              variant="outlined"
              name="lastName"
              label="Last Name"
              value={userData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              variant="outlined"
              name="email"
              label="Email"
              value={userData.email}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <div style={{ display: "flex" }}>
              <TextField
                size="small"
                variant="outlined"
                type="password"
                name="password"
                label="Password"
                value={userData.password}
                onChange={handleInputChange}
                fullWidth
                error={passwordError !== ""}
                helperText={passwordError}
              />
              <Tooltip
                style={{ marginLeft: 5, padding: 0 }}
                title="Password must be 8 to 25 characters long with at least one uppercase and one lowercase letter"
              >
                <IconButton size="small" aria-label="info">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              variant="outlined"
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid
            sx={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
            }}
            item
            xs={12}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(0, 0, 0, 0.5)",
                cursor: "pointer",
                marginLeft: 0.5,
              }}
            >
              Role:{"  "}
              <span style={{ color: "blue", textDecoration: "underline" }}>
                Know More
              </span>
            </Typography>

            <div className="checkbox-container">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.role === "owner"}
                    onChange={handleRoleChange}
                    value="owner"
                  />
                }
                label="Owner"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.role === "administrator"}
                    onChange={handleRoleChange}
                    value="administrator"
                  />
                }
                label="Administrator"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.role === "admin"}
                    onChange={handleRoleChange}
                    value="admin"
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.role === "read-only"}
                    onChange={handleRoleChange}
                    value="read-only"
                  />
                }
                label="Read-only"
              />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddUser} variant="contained" color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddUserDialog
