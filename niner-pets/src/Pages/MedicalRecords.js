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
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const MedicalRecords = () => {
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [recordType, setRecordType] = useState('');
  const [name, setName] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedVet, setSelectedVet] = useState(''); 
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [medicalData, setMedicalData] = useState([]);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [loadingVets, setLoadingVets] = useState(false); 
  const [errorVets, setErrorVets] = useState(null); 
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editRecord, setEditRecord] = useState(null); 

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
    setRecordType('');
    setName('');
    setSelectedPet('');
    setSelectedVet('');
    setDescription('');
    setDate('');
    setMessage('');
  };

  // Fetch medical records data
  const fetchMedicalData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/medicalrecords?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched medical data:', data);
        setMedicalData(data);
      } else {
        console.error('Failed to fetch medical records data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching medical records data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pets data
  useEffect(() => {
    if (userId === null) return;
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/pets?user_id=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        console.log('Fetched Pets:', data);  
        setPets(data);  
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
    fetchMedicalData();
  }, [userId]);

  // Fetch vets data
  useEffect(() => {
    const fetchVets = async () => {
      setLoadingVets(true);
      try {
        const response = await fetch('http://localhost:5000/vets');
        if (response.ok) {
          const data = await response.json();
          setVets(data);
        } else {
          throw new Error('Error fetching vets');
        }
      } catch (error) {
        setErrorVets('Error fetching veterinarians.');
        console.error(error);
      } finally {
        setLoadingVets(false);
      }
    };
    fetchVets();
  }, []);  

  const handleAddRecord = async () => {
    const payload = {
      user_id: userId,
      pet_id: selectedPet,
      vet_id: selectedVet,
      record_type: recordType,
      description: description,
      date: date,
      name: name,
    };
  
    console.log('Sending payload:', payload);
  
    try {
      const response = await fetch('http://localhost:5000/medicalrecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const newEntry = await response.json();
        setMedicalData(prevData => [...prevData, newEntry]); 
        handleClose();
        setSnackbarMessage('Medical record added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchMedicalData(); 
      } else {
        const errorResponse = await response.text();
        console.error("Failed to add medical record:", response.status, errorResponse);
        setSnackbarMessage('Failed to add medical record.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error occurred while adding medical record:", error);
      setSnackbarMessage('Error occurred while adding medical record.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };  

  const handleDelete = async (recordId) => {
    try {
      const response = await fetch(`http://localhost:5000/medicalrecords/${recordId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMedicalData((prevData) => prevData.filter((record) => record.id !== recordId));
        setSnackbarMessage('Record deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        console.error(`Failed to delete record with ID ${recordId}. Status: ${response.status}`);
        setSnackbarMessage('Failed to delete record.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error occurred while deleting record:', error);
      setSnackbarMessage('Error occurred while deleting record.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };  

  const handleEdit = (recordId) => {
    const recordToEdit = medicalData.find(record => record.id === recordId);
    
    if (!recordToEdit) {
      console.log("Record not found.");
      return;
    }
  
    setEditRecord(recordToEdit);
    setSelectedPet(recordToEdit.pet_id);
    setSelectedVet(recordToEdit.vet_id);  
    
    setOpenEditDialog(true); 
  };  

  const handleSave = async () => {
    console.log('Edit Record:', editRecord); 
  
    if (!editRecord.name || !editRecord.date || !editRecord.description || !editRecord.record_type || !editRecord.pet_id || !editRecord.vet_id) {
      setSnackbarMessage('All fields must be filled out!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; 
    }
  
    const payload = {
      user_id: userId,
      pet_id: editRecord.pet_id,
      vet_id: editRecord.vet_id,
      record_type: editRecord.record_type,
      description: editRecord.description,
      date: editRecord.date,
      name: editRecord.name,
    };
  
    console.log('Updating record:', payload);
  
    try {
      const response = await fetch(`http://localhost:5000/medicalrecords/${editRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const updatedRecord = await response.json();
        setMedicalData((prevData) =>
          prevData.map((record) =>
            record.id === updatedRecord.id ? updatedRecord : record
          )
        );
        setSnackbarMessage('Medical record updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpenEditDialog(false); 
        await fetchMedicalData();
      } else {
        const errorResponse = await response.text();
        console.error("Failed to update medical record:", response.status, errorResponse);
        setSnackbarMessage('Failed to update medical record.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error occurred while updating medical record:", error);
      setSnackbarMessage('Error occurred while updating medical record.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };   
  
  const handleInputChange = (e) => {
    setEditRecord({
      ...editRecord,
      [e.target.name]: e.target.value, 
    });
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
          Medical Records
        </Typography>
      </Box>

      {/* Add Medical Record Section */}
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
          aria-label="add record"
        >
          <AddIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          Add a Medical Record
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '0 auto', marginTop: 2 }} />
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 0 }}>
          {['Exam', 'Medication', 'Vaccine'].map((type) => (
            <Grid item xs={6} key={type}>
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  height: '300px',
                  margin: '0 auto',
                  marginBottom: 0,
                  position: 'relative',
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {type} Records
                  <Divider sx={{ margin: '10px 0', borderWidth: 1 }} />
                </Typography>
                {medicalData.filter((record) => record.record_type === type).length === 0 ? (
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'gray' }}>
                    No {type.toLowerCase()} records found.
                  </Typography>
                ) : (
                  medicalData
                    .filter((record) => record.record_type === type)
                    .map((record) => (
                      <Paper
                        key={record.id}
                        sx={{
                          padding: 2,
                          marginBottom: 2,
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '120px',
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {record.pet_name} - {record.name}
                          <Divider sx={{ margin: '5px 0' }} />
                        </Typography>
                        <Typography variant="body2">
                          {record.date} - {record.description}
                        </Typography>
                        <Typography variant="body2">
                          Vet: {record.vet_name}
                        </Typography>
                        <IconButton
                          onClick={() => handleEdit(record.id)}
                          sx={{ position: 'absolute', bottom: 8, right: 8, marginRight: 4 }}
                          aria-label="edit record"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(record.id)}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                          }}
                          aria-label="delete record"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Adding a Record */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add Medical Record
          </Typography>

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
            label="Record Type"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Exam">Exam</MenuItem>
            <MenuItem value="Medication">Medication</MenuItem>
            <MenuItem value="Vaccine">Vaccine</MenuItem>
          </TextField>

          <TextField
            label="Record Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            select
            label="Select a Vet"
            value={selectedVet}
            onChange={(e) => setSelectedVet(e.target.value)}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            {vets.map((vet) => (
              <MenuItem key={vet.id} value={vet.id}>
                {vet.name}
              </MenuItem>
            ))}
          </TextField>

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
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddRecord}>Add Record</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit Medical Record
          </Typography>
          
          <TextField
            select
            label="Select a Pet"
            value={editRecord?.pet_id || ''}
            onChange={(e) => setEditRecord({ ...editRecord, pet_id: e.target.value })}
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
            label="Record Type"
            value={editRecord?.record_type || ''}
            onChange={(e) => setEditRecord({ ...editRecord, record_type: e.target.value })}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            {['Exam', 'Medication', 'Vaccine'].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Record Title"
            value={editRecord?.name || ''}
            onChange={(e) => setEditRecord({ ...editRecord, name: e.target.value })}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            select
            label="Select a Vet"
            value={editRecord?.vet_id || ''}
            onChange={(e) => setEditRecord({ ...editRecord, vet_id: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
            required
          >
            {vets.map((vet) => (
              <MenuItem key={vet.id} value={vet.id}>
                {vet.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            value={editRecord?.description || ''}
            onChange={(e) => setEditRecord({ ...editRecord, description: e.target.value })}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Date"
            type="date"
            value={editRecord?.date || ''}
            onChange={(e) => setEditRecord({ ...editRecord, date: e.target.value })}
            required
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    )
};

export default MedicalRecords;