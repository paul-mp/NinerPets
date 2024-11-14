import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState, useEffect } from 'react';

const Billing = () => {
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [balanceType, setBalanceType] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [pets, setPets] = useState([]); 
  const [billingData, setBillingData] = useState([]); 
  const [message, setMessage] = useState('');
  const [viewDetailsType, setViewDetailsType] = useState(null); 
  const [detailsOpen, setDetailsOpen] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserId(data.id); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetailsOpen(false);
    setBalanceType('');
    setSelectedPet('');
    setPrice('');
    setDescription('');
    setDate('');
    setMessage('');
  };  

  const handleCancel = () => {
    console.log('Closing dialog');
    setEditDialogOpen(false);
    setEditDialogOpen(false); 
  };  

  const fetchBillingData = async () => {
    if (!userId) return;
    setLoading(true); 
    try {
        const response = await fetch(`http://localhost:5000/billing?user_id=${userId}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched billing data:', data); 
            setBillingData(data); 
        } else {
            console.error('Failed to fetch billing data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching billing data:', error);
    } finally {
        setLoading(false); 
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      const response = await fetch(`http://localhost:5000/pets?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        console.error("Failed to fetch pets:", response.status);
      }
    };

    fetchPets();
    fetchBillingData();
  }, [userId]);

  const handleAddBalance = async () => {
    if (!selectedPet || !balanceType || !price || !description || !date) {
      setSnackbarMessage('All fields are required!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; 
    }
  
    if (parseFloat(price) > 10000 || parseFloat(price) <= 0) {
      setSnackbarMessage('Price must be between .1 and 10,000!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; 
    }
  
    try {
      const response = await fetch('http://localhost:5000/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          pet_id: selectedPet,
          type: balanceType,
          price: parseFloat(price),
          description,
          date,
        }),
      });
  
      if (response.ok) {
        const newEntry = await response.json(); 
        setBillingData((prevData) => [...prevData, newEntry]); 
        handleClose(); 
        setSnackbarMessage('Balance added successfully!'); 
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        const errorResponse = await response.text(); 
        console.error("Failed to add billing entry:", response.status, errorResponse);
        setSnackbarMessage('Failed to add billing entry.'); 
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error occurred while adding billing entry:", error);
      setSnackbarMessage('Error occurred while adding billing entry.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  const handleViewDetails = (type) => {
    setViewDetailsType(type);
    setDetailsOpen(true);
  };

  const calculateTotal = (billingData, type) => {
    const filteredData = billingData.filter(item => item.type === type);
    console.log(`Filtered ${type} data:`, filteredData);
  
    const total = filteredData.reduce((acc, item) => {
      console.log(`Item Price: ${item.price}, Type: ${item.type}`); 
      return acc + (typeof item.price === 'number' ? item.price : 0);
    }, 0);
  
    console.log(`Total for ${type}:`, total);
    return total.toFixed(2); 
  };  

  const handleDeleteBalance = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/billing/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setBillingData((prevData) => prevData.filter((entry) => entry.id !== id)); 
        setSnackbarMessage('Billing entry deleted successfully');
        setSnackbarSeverity('success');
      } else {
        throw new Error('Failed to delete billing entry');
      }
    } catch (error) {
      setSnackbarMessage('Error occurred while deleting billing entry');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };  

const handleEdit = (id) => {
    const billingToEdit = billingData.find(bill => bill.id === id);
    if (billingToEdit) {
        setSelectedPet(billingToEdit.pet_id);
        setBalanceType(billingToEdit.type);
        setPrice(billingToEdit.price);
        setDescription(billingToEdit.description);
        setDate(billingToEdit.date);
        setCurrentEdit(id); 
        setEditDialogOpen(true); 
    }
};

const handleSaveEdit = async () => {
  if (!selectedPet || !balanceType || !price || !description || !date) {
      setSnackbarMessage('All fields are required!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
  }

  const priceValue = parseFloat(price);
  if (priceValue > 10000 || priceValue <= 0.1) {
      setSnackbarMessage('Price must be between 0.1 and 10,000!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
  }

  try {
      const response = await fetch(`http://localhost:5000/billing/${currentEdit}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              pet_id: selectedPet,
              type: balanceType,
              price: priceValue,
              description,
              date,
          }),
      });

      if (response.ok) {
          const updatedEntry = await response.json();
          setBillingData((prevData) => 
              prevData.map((entry) =>
                  entry.id === updatedEntry.id ? updatedEntry : entry
              )
          );

          setSnackbarMessage('Entry updated successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          await fetchBillingData(); 

      } else {
          throw new Error('Failed to update billing entry');
      }
  } catch (error) {
      console.error('Update error:', error);
      setSnackbarMessage('Error occurred while updating billing entry');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
  } finally {
      setEditDialogOpen(false); 
      setSelectedPet('');
      setBalanceType('');
      setPrice('');
      setDescription('');
      setDate('');
  }
};

  
const handleEditChange = (event) => {
  const { name, value } = event.target;
  setCurrentEdit((prevEdit) => ({
      ...prevEdit,
      [name]: value,
  }));
};

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box
        sx={{
          padding: '10px',
          marginBottom: '20px',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
          borderRadius: '6px',
        }}
      >
        <Typography variant="h4" align="left" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Billing Summary
        </Typography>
      </Box>

      {/* Message Display */}
      {message && (
        <Typography variant="body1" color={message.startsWith('Error') ? 'error' : 'primary'} sx={{ marginBottom: 2 }}>
          {message}
        </Typography>
      )}

      {/* Add a Balance Section */}
      <Box
        sx={{
          padding: '10px',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={handleClickOpen}
          sx={{
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            marginRight: 1,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          aria-label="add balance"
        >
          <AddIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          Add a Balance
        </Typography>
      </Box>
          
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '0 auto', marginTop: 2 }} />
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 0 }}>
          {/* Balance Cards */}
          {['Appointment', 'Medication', 'Vaccine'].map((type) => (
            <Grid item xs={6} key={type}>
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  height: '300px',
                  margin: '0 auto',
                  position: 'relative',
                  padding: 2,
                  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {type} Balance
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  Amount Due:
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'primary.main',
                  }}
                >
                  {/* Display calculated total for the specific balance type */}
                  ${calculateTotal(billingData, type)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center' }}
                  onClick={() => handleViewDetails(type)}
                >
                  <BookIcon sx={{ marginRight: 1 }} />
                  <Typography sx={{ color: 'white' }}>View Balance Details</Typography>
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Add Balance Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add Balance Details
          </Typography>

          {/* Pet Selection Dropdown */}
          <TextField
            select
            label="Select a Pet"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            {pets.map((pet) => (
              <MenuItem key={pet.id} value={pet.id}>
                {pet.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Balance Type Dropdown */}
          <TextField
            select
            label="Balance Type"
            value={balanceType}
            onChange={(e) => setBalanceType(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Appointment">Appointment</MenuItem>
            <MenuItem value="Medication">Medication</MenuItem>
            <MenuItem value="Vaccine">Vaccine</MenuItem>
          </TextField>

          {/* Price Input */}
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />

          {/* Description Input */}
          <TextField
            label="Description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          {/* Date Input */}
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddBalance} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Viewing Details */}
      <Dialog open={detailsOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {viewDetailsType} Balance Details
            <Box sx={{ borderBottom: '1px solid #ccc', marginTop: 1 }} />
          </Typography>
          {billingData.filter(entry => entry.type === viewDetailsType).length === 0 ? (
            <Typography>No current balances.</Typography>
          ) : (
            <Box component="ul" sx={{ paddingLeft: 2 }}>
              {billingData
                .filter(entry => entry.type === viewDetailsType)
                .map((entry) => {
                  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <Box component="li" key={entry.id} sx={{ marginBottom: 1, position: 'relative' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography>
                            <strong>{entry.pet_name}</strong>: ${entry.price}
                          </Typography>
                          <Typography variant="body2">
                            {formattedDate}: {entry.description}
                          </Typography>
                        </Box>
                          <IconButton 
                            onClick={() => handleEdit(entry.id)}
                            color="primary" 
                            sx={{ marginRight: 6 }} 
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteBalance(entry.id)} 
                          color="primary"
                          sx={{ position: 'absolute', right: 0, top: 0 }} 
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ borderBottom: '1px solid #ccc', marginTop: 1, width: '100%' }} />
                    </Box>
                  );
                })}
            </Box>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Billing Entry Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancel}>
        <DialogContent>
          <Typography variant="h6" marginBottom="15px">Edit Billing Entry</Typography>
          <TextField
            select
            label="Select a Pet"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            {pets.map((pet) => (
              <MenuItem key={pet.id} value={pet.id}>
                {pet.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Balance Type"
            value={balanceType}
            onChange={(e) => setBalanceType(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Appointment">Appointment</MenuItem>
            <MenuItem value="Medication">Medication</MenuItem>
            <MenuItem value="Vaccine">Vaccine</MenuItem>
          </TextField>

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for displaying messages */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Billing;