import { Alert, Box, Button, Grid, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar.js';
import LoginPage from './Pages/Login';
import './Styles/App.css';

// Custom theme for buttons
const theme = createTheme({
  palette: {
    primary: {
      main: '#005035', // Custom color for primary buttons
    },
    secondary: {
      main: '#005035', // Custom color for secondary buttons
    }
  },
});

function HomePage() {
  return (
    <>
      {/* Welcome Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          height: 'calc(100vh - 64px)',
          zIndex: 1,
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '3rem', margin: '20px 0' }}>Welcome to NinerPets</h1>
        <p style={{ color: '#fff', fontSize: '1.5rem' }}>The one-stop tool for all pet needs for UNC Charlotte students!</p>
      </div>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 2, marginTop: '-100vh', position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {/* Yellow Section: Navigation */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                <strong>Welcome, User!</strong>
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained">Schedule an Appointment</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">Messages</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">Visits</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">Test Results</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">Medications</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">Billing Summary</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Red Section: Latest Updates */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Latest Updates</strong>
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Weather Alert:</strong> Some locations may be closed or opening late.
                  </Typography>
                  <Button variant="contained" color="primary">Learn More</Button>
                  <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>Dismiss</Button>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>New MRI Scan:</strong> Learn how to prepare for your visit.
                  </Typography>
                  <Button variant="contained" color="primary">View Instructions</Button>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>NinerPets:</strong> On Oct. 15, your older medical data will be securely archived.
                  </Typography>
                  <Button variant="contained" color="primary">Learn More</Button>
                  <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>Dismiss</Button>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Appointment Alert:</strong> On September 10th, your appointment was canceled.
                  </Typography>
                  <Button variant="contained" color="primary">Learn More</Button>
                  <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>Dismiss</Button>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>New Appointment:</strong> Learn how to prepare for your visit.
                  </Typography>
                  <Button variant="contained" color="primary">Learn More</Button>
                  <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>Dismiss</Button>
                </Paper>
              </Box>
            </Paper>
          </Grid>

          {/* Blue Section: Doctors */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Care Team and Recent Providers</strong>
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Doctor 1, MD</strong>
                    <br />
                    Dog vet
                  </Typography>
                  <Button variant="outlined" color="primary">Details</Button>
                </Paper>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Doctor 2, MD</strong>
                    <br />
                    Cat vet
                  </Typography>
                  <Button variant="outlined" color="primary">Details</Button>
                </Paper>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Doctor 3, MD</strong>
                    <br />
                    Dog vet
                  </Typography>
                  <Button variant="outlined" color="primary">Details</Button>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Function to trigger login success message
  const handleLoginSuccess = () => {
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
    }, 3000); // Hide after 3 seconds
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      {loginSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 10, 
            minWidth: '300px',
            padding: 2
          }}>
          Login successful!
        </Alert>
      )}
      <br></br>
      <br></br>
      <br></br>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} /> 
      </Routes>
    </ThemeProvider>
  );
}

export default App;
