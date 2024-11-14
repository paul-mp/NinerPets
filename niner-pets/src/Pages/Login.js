import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_or_username: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        if (!data.token) {
          console.error('No token received from server');
          setErrorMessage("Login failed: No authentication token received");
          return;
        }
        
        setErrorMessage("");
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        onLoginSuccess();
        navigate("/home");
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during login");
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
      <Paper elevation={4} sx={{ padding: 8, borderRadius: 5, width: "450px" }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 3 }}>
          <strong>Login</strong>
        </Typography>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email or Username" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2, backgroundColor: "#005035", "&:hover": { backgroundColor: "#003f29" }, borderRadius: "30px", width: "321px", height: "50px" }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;