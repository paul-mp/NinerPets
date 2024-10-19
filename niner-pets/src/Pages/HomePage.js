import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="app-background">

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          {/* Navigation Buttons */}
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
                <Button variant="contained" component={Link} to="/billing">Billing Summary</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Latest Updates */}
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

          {/* Doctors Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Care Team and Recent Providers</strong>
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Dr. Susan Farley, DVM</strong>
                    <br />
                    Dog Vet
                  </Typography>
                  <Button variant="outlined" color="primary" component={Link} to="/vets/">Details</Button>
                </Paper>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Dr. Colin Pace, DVM</strong>
                    <br />
                    Cat Vet
                  </Typography>
                  <Button variant="outlined" color="primary" component={Link} to="/vets/">Details</Button>
                </Paper>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Dr. Leah Zimmerman, DVM</strong>
                    <br />
                    Exotic Pets Vet
                  </Typography>
                  <Button variant="outlined" color="primary" component={Link} to="/vets/">Details</Button>
                </Paper>
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Dr. Emily Carter, DVM</strong>
                    <br />
                    Reptile Vet
                  </Typography>
                  <Button variant="outlined" color="primary" component={Link} to="/vets/">Details</Button>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default HomePage;
