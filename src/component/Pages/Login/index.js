"use client";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import styles from "./Login.module.scss";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/hooks/useSnakBar";
const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const { openSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onSubmit = async () => {
    const { error } = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    console.log(error);
    if (!error) {
      router.push("/");
    } else {
      openSnackbar("error", error);
    }
  };
  return (
    <div className={styles.component}>
      <FormGroup>
        <Card className={styles.LoginCard}>
          <div className={styles.header}>
            <h2>Login</h2>
            <Link href={"/"}>no account yet?</Link>
          </div>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            type="email"
            size="small"
            fullWidth
          />
          <OutlinedInput
            onChange={(e) => setPassword(e.target.value)}
            required
            id="outlined-adornment-password"
            placeholder="Password"
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
          <div className={styles.formFooter}>
            <span className={styles.rememberMe}>
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label="Remember me"
              />
            </span>
            <Link href={"/forgot-password"}>Forgot password?</Link>
          </div>
          <Button
            onClick={onSubmit}
            size="small"
            type="submit"
            variant="contained"
            fullWidth
          >
            Login
          </Button>
        </Card>
      </FormGroup>
    </div>
  );
};

export default Login;
