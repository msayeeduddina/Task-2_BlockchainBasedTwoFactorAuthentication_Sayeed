import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { setRegisterUser, setAuthenticateUser, getGenerateOTP } from "../ContractAction/OTP"; // Adjust the import path as necessary
import './Dashboard.css';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const InputField = ({ label, value, onChange, id }) => (
  <Box className="formItem">
    <Typography variant="caption" gutterBottom>
      {label}
    </Typography>
    <TextField
      fullWidth
      id={id}
      variant="outlined"
      value={value}
      onChange={onChange}
      className="inputField"
    />
  </Box>
);

const TwoFactorAuth = () => {
  const [formData, setFormData] = useState({
    username: "",
    publicKey: "",
    otpSeed: "",
    userAddress: "",
    authUserAddress: "",
    otp: "",
    generatedOtp: "",
    message: "",
    timer: null,
    timerSeconds: 30,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async () => {
    const { username, publicKey, otpSeed } = formData;
    try {
      await setRegisterUser(username, publicKey, otpSeed);
      setFormData((prev) => ({
        ...prev,
        username: "",
        publicKey: "",
        otpSeed: "",
        message: "User registered successfully!",
      }));
    } catch (error) {
      setFormData((prev) => ({ ...prev, message: "Registration failed." }));
    }
  };

  const handleGenerateOTP = async () => {
    const { userAddress } = formData;
    if (!userAddress) {
      alert("Please enter a user address.");
      return;
    }
    try {
      const otp = await getGenerateOTP(userAddress);
      if (otp) {
        setFormData((prev) => ({
          ...prev,
          generatedOtp: otp,
          message: `OTP generated successfully! Your OTP is ${otp}.`,
          userAddress: "",
          timerSeconds: 30,
          timer: setInterval(() => {
            setFormData((prev) => ({
              ...prev,
              timerSeconds: prev.timerSeconds - 1,
            }));
          }, 1000),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          message: "Error generating OTP.",
        }));
      }
    } catch (error) {
      setFormData((prev) => ({ ...prev, message: "Error generating OTP." }));
    }
  };

  const handleAuthenticate = async () => {
    const { authUserAddress, otp } = formData;
    if (!authUserAddress || !otp) {
      alert("Please enter both user address and OTP.");
      return;
    }

    try {
      const isAuthenticated = await setAuthenticateUser(authUserAddress, otp);
      if (isAuthenticated) {
        alert("User authenticated successfully!");
        setFormData((prev) => ({ ...prev, authUserAddress: "", otp: "", message: "" })); // Clear message on success
      } else {
        setFormData((prev) => ({ ...prev, message: "Authentication failed." }));
      }
    } catch (error) {
      setFormData((prev) => ({ ...prev, message: "Authentication failed." }));
    }
  };

  useEffect(() => {
    if (formData.timerSeconds === 0 && formData.timer) {
      clearInterval(formData.timer);
      setFormData((prev) => ({
        ...prev,
        timer: null,
        timerSeconds: 30,
      }));
    }
  }, [formData.timerSeconds]);

  return (
    <Box className="root">
      <Box sx={{ width: '100%' }}>
        <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Item>
            <Box>
              <Typography variant="h6" gutterBottom>
                Two-Factor Authentication
              </Typography>

              <InputField label="Username" value={formData.username} onChange={handleChange} id="username" />
              <InputField label="Public Key" value={formData.publicKey} onChange={handleChange} id="publicKey" />
              <InputField label="OTP Seed" value={formData.otpSeed} onChange={handleChange} id="otpSeed" />

              <Button variant="contained" className="button" onClick={handleRegister}>
                Register User
              </Button>

            </Box>
          </Item>
          <Item>
            <Box sx={{ marginTop: '20px', width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Generate OTP
              </Typography>
              <InputField label="User Address" value={formData.userAddress} onChange={handleChange} id="userAddress" />

              <Button variant="contained" className="button" onClick={handleGenerateOTP}>
                Generate OTP
              </Button>

              {formData.message && (
                <Typography
                  color={formData.message.startsWith("Error") || formData.message.startsWith("Authentication failed") ? "red" : "green"}
                  sx={{ marginTop: '10px' }}
                >
                  {formData.message}
                </Typography>
              )}

              {formData.generatedOtp && (
                <Box className="formItem" mt={2}>
                  <Typography variant="caption" gutterBottom>
                    Generated OTP
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.generatedOtp}
                    readOnly
                    className="inputField"
                  />
                </Box>
              )}

              {/* Timer Display */}
              {formData.timer && (
                <Typography variant="caption" color="primary" sx={{ marginTop: '10px' }}>
                  OTP expires in {formData.timerSeconds} seconds
                </Typography>
              )}
            </Box>

          </Item>
          <Item>
            <Box sx={{ marginTop: '20px', width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Authenticate User
              </Typography>
              <InputField label="User Address for Authentication" value={formData.authUserAddress} onChange={handleChange} id="authUserAddress" />
              <InputField label="Enter OTP" value={formData.otp} onChange={handleChange} id="otp" />

              <Button variant="contained" className="button" onClick={handleAuthenticate}>
                Authenticate User
              </Button>
            </Box>
          </Item>
        </Stack>
      </Box>
    </Box>
  );
};

export default TwoFactorAuth;