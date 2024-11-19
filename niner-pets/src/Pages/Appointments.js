import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, MenuItem, Snackbar, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

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
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [vets, setVets] = useState([]);
  const [otherReasonExplanation, setOtherReasonExplanation] = useState('');
  const [pets, setPets] = useState([]); 
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [username, setUsername] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const handlePetChange = (e) => setSelectedPet(e.target.value);
  const handleVetChange = (e) => setSelectedVet(e.target.value);
  const handleReasonChange = (e) => setSelectedReason(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleTimeChange = (e) => setSelectedTime(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
    
        const response = await fetch('http://localhost:5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        console.log('User Data Response:', response); // Log the response
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
    
        const data = await response.json();
        setUserId(data.id);
        setUsername(data.username); // Set the username from fetched data
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return; // Don't run the effect until userId is set
  
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
  
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/pets?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        const data = await response.json();
        setPets(data);
      } catch (error) {
        setError('');
      }
    };
  
    fetchVets();
    fetchPets();
  }, [userId]);

  const handleScheduleAppointment = async (event) => {
    event.preventDefault();
  
    if (!userId) {
      setError('User not authenticated');
      return;
    }
  
    const selectedVetObj = vets.find(vet => vet.name === selectedVet);
    const vetId = selectedVetObj ? selectedVetObj.id : null;
  
    const appointmentData = {
      user_id: userId,
      pet_id: selectedPet,
      vet_id: vetId,
      reason: selectedReason,
      date: selectedDate,
      time: selectedTime,
      location: selectedLocation,
      notes: notes,
    };
  
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to schedule appointment');
      }
  
      setOpenSnackbar(true); 
      setError('');  
  
      setSelectedPet('');
      setSelectedVet('');
      setSelectedReason('');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedLocation('');
      setNotes('');
      setOtherReasonExplanation('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error scheduling appointment: ' + error.message); 
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const WhiteIconAlert = styled(Alert)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, 
    color: 'white', 
    '& .MuiAlert-icon': {
      color: 'white !important', 
    },
  }));

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
      <Box sx={{ marginBottom: 2 }}>
          {pets.length === 0 && (
            <WhiteIconAlert severity="info">
              No pets found. Please{' '}
              <Link 
                to="/manage-pets" 
                style={{
                  fontWeight: 'bold', 
                  textDecoration: 'none', 
                  color: 'white', 
                  transition: 'color 0.3s', 
                }}
                onMouseEnter={(e) => e.target.style.color = 'black'} 
                onMouseLeave={(e) => e.target.style.color = 'white'} 
              >
                go to the Manage Pets page
              </Link>{' '}
              to add a pet before making an appointment.
            </WhiteIconAlert>
          )}
        </Box>
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
                {isDataLoaded ? `Welcome back, ${username}!` : <CircularProgress />}
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
                <form onSubmit={handleScheduleAppointment}>
                  <TextField
                    select
                    fullWidth
                    label="Select a Pet"
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required>
                    {pets.map(pet => (
                      <MenuItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Reason for Visit"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
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
                  {selectedReason === 'Other' && (
                    <TextField
                      fullWidth
                      label="Please explain"
                      multiline
                      rows={4}
                      value={otherReasonExplanation}
                      onChange={(e) => setOtherReasonExplanation(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                  )}

                  <TextField
                    select
                    fullWidth
                    label="Select a Vet"
                    value={selectedVet}
                    onChange={(e) => setSelectedVet(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required>
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
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required />

                  <TextField
                    fullWidth
                    label="Choose a Time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required />

                  <TextField
                    select
                    fullWidth
                    label="Select a Location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required>
                    <MenuItem value="2734 Diamond Street">2734 Diamond Street</MenuItem>
                    <MenuItem value="1825 Dola Mine Road">1825 Dola Mine Road</MenuItem>
                    <MenuItem value="402 College Avenue">402 College Avenue</MenuItem>
                    <MenuItem value="3888 Beechwood Avenue">3888 Beechwood Avenue</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    margin="normal"
                    variant="outlined" />

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