"use client";
import React, { useState } from "react";
import {
  Button,
  FormGroup,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Card from "@mui/material/Card";
import styles from "./ResetPassword.module.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
const ResetPassword = () => {
  const router = typeof window !== "undefined" ? window.location.href : "";

  // Extract the token substring after 'token='
  const resetToken = router.substring(
    router.indexOf("token=") + "token=".length
  );
  // Output: d3cfa334ee6ced82d14417223fc0f19692689fefda9f30cf52b1b6b4a70165c9

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const resetPassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post(`api/reset-password`, {
          resetToken: resetToken,
          newPassword: confirmPassword,
        });
        console.log(response);
      } catch (error) {
        console.error("Error in sending  password reset link:", error);
      }
    } else {
      console.error("Please  enter the same Password!");
    }
  };
  return (
    <div className={styles.component}>
      <FormGroup>
        <Card className={styles.LoginCard}>
          <div className={styles.header}>
            <h2>Reset Password</h2>
          </div>
          <OutlinedInput
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            required
            id="outlined-adornment-password"
            placeholder="New Password"
            size="small"
            fullWidth
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <OutlinedInput
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            id="outlined-adornment-password"
            placeholder="Confirm Password"
            size="small"
            fullWidth
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            onClick={resetPassword}
            size="small"
            variant="contained"
            fullWidth
          >
            Save
          </Button>
        </Card>
      </FormGroup>
    </div>
  );
};

export default ResetPassword;
