import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, MenuItem, Snackbar } from '@mui/material';

const visitReasons = [
  "Routine Checkup",
  "Vaccination",
  "Surgery Consultation",
  "Dental Cleaning",
  "Behavioral Issues",
  "Skin Problems",
  "Other",
];

function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [vets, setVets] = useState([]); 
  const [error, setError] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await fetch('http://localhost:5000/vets'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVets(data);
      } catch (error) {
        setError('Error fetching vet data: ' + error.message);
      }
    };

    fetchVets();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleVetChange = (event) => {
    setSelectedVet(event.target.value);
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleScheduleAppointment = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filteredVets = vets.filter(vet =>
    vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-background">
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{
                padding: '15px',
                textAlign: 'left',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',  
                borderRadius: '6px'  
              }}>
              <Typography variant="h4" gutterBottom>
                <strong>Make an Appointment</strong>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{
                padding: '15px',
                textAlign: 'center',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',  
                borderRadius: '6px'  
              }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}> 
                Welcome back, User!
              </Typography>
            </Paper>
          </Grid>

          <Grid container item xs={12} spacing={4} justifyContent="center"> 
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={3} 
                sx={{
                  padding: 4, 
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', 
                  borderRadius: '15px',
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  width: '100%',
                  margin: 'auto'
                }}>
                <Typography variant="h6" gutterBottom>
                  Create an Appointment
                </Typography>
                <form onSubmit={(e) => { e.preventDefault(); handleScheduleAppointment(); }}>
                  <TextField
                    select
                    fullWidth
                    label="Select a Pet"
                    margin="normal"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="Pet 1">Pet 1</MenuItem>
                    <MenuItem value="Pet 2">Pet 2</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Reason for Visit"
                    value={selectedReason}
                    onChange={handleReasonChange}
                    margin="normal"
                    variant="outlined"
                    required
                  >
                    {visitReasons.map(reason => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Select a Vet"
                    value={selectedVet}
                    onChange={handleVetChange}
                    margin="normal"
                    variant="outlined"
                    required
                  >
                    {filteredVets.map(vet => (
                      <MenuItem key={vet.name} value={vet.name}>
                        {vet.name} ({vet.specialty})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Choose a Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <TextField
                    fullWidth
                    label="Choose a Time"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <TextField
                    select
                    fullWidth
                    label="Select a Location"
                    margin="normal"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="Location 1">Location 1</MenuItem>
                    <MenuItem value="Location 2">Location 2</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />

                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2, width: '100%' }}
                    type="submit"
                  >
                    Schedule Appointment
                  </Button>
                </form>
                <Snackbar
                  open={openSnackbar}
                  onClose={handleCloseSnackbar}
                  message="Appointment Scheduled!"
                  autoHideDuration={3000}
                  ContentProps={{
                    sx: {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper 
                elevation={3} 
                sx={{
                  padding: 4, 
                  backgroundColor: '#fff', 
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', 
                  borderRadius: '15px', 
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  width: '100%',
                  margin: 'auto'
                }}>
                <Typography variant="h6" gutterBottom>
                  Search Vets
                </Typography>
                <TextField
                  fullWidth
                  label="Enter vet name or specialty"
                  margin="normal"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearch}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Results:</Typography>
                  {error && <Typography color="error">{error}</Typography>}
                  {filteredVets.length === 0 ? (
                    <Typography>No results found.</Typography>
                  ) : (
                    filteredVets.map(vet => (
                      <Paper 
                        key={vet.name} 
                        sx={{
                          padding: 2, 
                          marginTop: 1, 
                          border: '1.5px solid', 
                          borderColor: 'primary.main',
                          borderRadius: '10px', 
                          backgroundColor: '#f9f9f9',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedVet(vet.name);
                          setSearchTerm('');
                        }}
                      >
                        <Typography variant="body1">{vet.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{vet.specialty}</Typography>
                      </Paper>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Appointments;