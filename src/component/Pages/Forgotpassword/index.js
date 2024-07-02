"use client";
import { Button, FormGroup } from "@mui/material";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import styles from "./ForgotPassword.module.scss";
import { useState } from "react";
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = useState("");
  const sendResetLink = async () => {
    try {
      const response = await axios.post(`api/send-password-reset-token`, {
        email,
      });
      console.log(response);
    } catch (error) {
      console.error("Error in sending  password reset link:", error);
    }
  };
  return (
    <div className={styles.component}>
      <FormGroup>
        <Card className={styles.LoginCard}>
          <div className={styles.header}>
            <h2>Forgot password?</h2>
            <p>
              Dont worry. <br />
              Please enter the email address associated with this account, and
              we will send you a link to reset your password.
            </p>
          </div>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            type="email"
            size="small"
            fullWidth
          />

          <Button
            onClick={sendResetLink}
            size="small"
            type="submit"
            variant="contained"
            fullWidth
          >
            Send Email
          </Button>
        </Card>
      </FormGroup>
    </div>
  );
};

export default Signup;
