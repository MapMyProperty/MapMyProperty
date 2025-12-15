import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import Box from "components/Box";
import Input from "components/Input";
import { Switch } from "@mui/material";
import Typography from "components/Typography";
import Button from "components/Button";
import { Link } from "react-router-dom";
import { useController } from "context";
import { setAuth } from "context";
import toast from "react-hot-toast";
import image from "assets/images/android-chrome-512x512.png";

const Login = () => {
  const [controller, dispatch] = useController();
  const [data, setData] = useState({});
  const handleLogin = () => {
    if (
      process.env.REACT_APP_USERNAME === data?.email &&
      process.env.REACT_APP_PASSWORD === data?.password
    ) {
      localStorage.setItem("developer_mode", false);
      localStorage.setItem("Tokens", JSON.stringify({ accessToken: "authenticated_section" })); // Persist auth
      toast.success("Admin Login Successful");
      setAuth(dispatch, true);
    } else if ("developer" === data?.email && process.env.REACT_APP_PASSWORD === data?.password) {
      localStorage.setItem("developer_mode", true);
      localStorage.setItem("Tokens", JSON.stringify({ accessToken: "developer_session" }));
      toast("Developer Login Successful", { icon: "💻" });
      setAuth(dispatch, true);
    } else {
      toast.error("Invalid username or password");
    }
  };
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <AuthLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={{
        title: "XSquare Realty",
        description: "Admin Management Console",
        image,
      }}
      color="primary"
    >
      <Box component="form" role="form">
        <Box mb={2}>
          <Input
            type="email"
            placeholder="Email / Username"
            size="large"
            onChange={handleChange}
            name="email"
            value={data?.email}
          />
        </Box>
        <Box mb={2}>
          <Input
            type="password"
            placeholder="Password"
            size="large"
            onChange={handleChange}
            name="password"
            value={data?.password}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Switch disabled />
          <Typography
            variant="button"
            fontWeight="regular"
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </Typography>
        </Box>
        <Box mt={4} mb={1}>
          <Button color="info" size="large" fullWidth onClick={handleLogin}>
            Sign In
          </Button>
        </Box>
        <Box mt={3} textAlign="center">
          <Typography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <Typography
              // component={Link}
              to="#"
              variant="button"
              color="info"
              fontWeight="medium"
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Login;
