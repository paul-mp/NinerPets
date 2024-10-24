import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const fetchVets = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/vets');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVets(data);
      } catch (error) {
        console.error('Error fetching vets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_username', {
          method: 'GET',
          credentials: 'include',  // Include credentials (session cookie)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch username');
        }

        const data = await response.json();
        setUsername(data.username);  // Set the fetched username in state
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();  // Fetch username when the component loads
  }, []);

  return (
    <div className="app-background">
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          {/* Navigation Buttons */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, minHeight: '110px', minWidth: '1100px'}}>
              <Typography variant="h5" gutterBottom>
                <strong>Welcome, {username}!</strong>  {/* Display fetched username */}
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" component={Link} to="/appointments">Schedule an Appointment</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/calendar">Calendar</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/medications">Medications</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/billing">Billing Summary</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/manage-pets">Manage Pets</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/medicalrecords">Medical Records</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/faq">FAQ Pages</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Latest Updates (Original Content) */}
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
                {loading ? ( 
                  <CircularProgress />
                ) : vets.length > 0 ? ( 
                  vets.map(vet => (
                    <Paper key={vet.id} elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>{vet.name}</strong>
                        <br />
                        {vet.specialty}
                      </Typography>
                      <Button variant="outlined" color="primary" component={Link} to="/vets">
                        Details
                      </Button>
                    </Paper>
                  ))
                ) : (
                  <Typography>No veterinarians available.</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default HomePage;