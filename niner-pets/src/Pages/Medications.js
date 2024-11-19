import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    IconButton,
    Modal,
    TextField,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Medications = () => {
    const [userId, setUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const [medications, setMedications] = useState([]);
    const [pets, setPets] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [selectedMedicationId, setSelectedMedicationId] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        petId: '', 
        name: '',
        dosage: '',
        description: '',
        startDate: '',
        endDate: '',
        sideEffects: '',
        instructions: '',
        refill: 'no',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

    const handleOpen = () => setOpen(true); 
    const handleClose = () => {
        setOpen(false);
        setFormData({
            petId: '',
            name: '',
            dosage: '',
            description: '',
            startDate: '',
            endDate: '',
            sideEffects: '',
            instructions: '',
            refill: 'no',
        });
        setSelectedMedicationId(null);
    };

    useEffect(() => {
        if (!userId) return;
        const fetchMedications = async () => {
            setLoading(true); 
            try {
                const response = await fetch(`http://localhost:5000/medications?user_id=${userId}`);
                const data = await response.json();
                setMedications(data.map(medication => ({
                    ...medication,
                    pet_name: medication.pet_name || 'Unknown' 
                })));
            } catch (error) {
                console.error('Error fetching medications:', error);
            } finally {
                setLoading(false); 
            }
        };
    
        fetchMedications();
    }, [userId]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(`http://localhost:5000/pets?user_id=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pets');
                }
                const data = await response.json();
                setPets(data); 
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };
    
        fetchPets();
    }, [userId]);
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSnackbarOpen = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };    

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        setFormLoading(true);
    
        if (!formData.petId || !formData.name || !formData.dosage || !formData.startDate || !formData.sideEffects || !formData.instructions) {
            handleSnackbarOpen("All fields except end date are required.", 'error');
            return; 
        }
    
        const refillValue = formData.refill === 'yes';
        const submissionData = {
            pet_id: formData.petId,
            user_id: userId,
            name: formData.name,
            dosage: formData.dosage,
            description: formData.description,
            start_date: formData.startDate,
            end_date: formData.endDate || null,
            side_effects: formData.sideEffects,
            instructions: formData.instructions,
            refill: refillValue,
        };
    
        try {
            const response = selectedMedicationId
                ? await fetch(`http://localhost:5000/medications/${selectedMedicationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                })
                : await fetch('http://localhost:5000/medications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                });
    
            if (!response.ok) {
                const errorData = await response.json();
                handleSnackbarOpen(`Error: ${errorData.error}`, 'error');
            } else {
                const responseData = await response.json();
                handleSnackbarOpen(responseData.message);

                if (selectedMedicationId) {
                    setMedications((prevMedications) => 
                        prevMedications.map((med) => 
                            med.id === selectedMedicationId 
                            ? { ...submissionData, id: selectedMedicationId, pet_name: pets.find(pet => pet.id === submissionData.pet_id)?.name }
                            : med
                        )
                    );
                } else {
                    setMedications((prevMedications) => [
                        ...prevMedications,
                        { ...submissionData, id: responseData.newMedicationId, pet_name: pets.find(pet => pet.id === submissionData.pet_id)?.name }
                    ]);
                }
    
                handleClose();  
            }
        } catch (error) {
            console.error('Error:', error);
            handleSnackbarOpen('An unexpected error occurred.', 'error');
        } finally {
            setFormLoading(false);  
        }
    };  

    const handleClickOpen = (id) => {
        setSelectedMedicationId(id);
        setConfirmDeleteOpen(true); 
    };
      

    const handleDelete = async () => {
        if (selectedMedicationId) {
            try {
                const response = await fetch(`http://localhost:5000/medications/${selectedMedicationId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete medication');
                }
    
                setMedications((prevMedications) => 
                    prevMedications.filter((medication) => medication.id !== selectedMedicationId)
                );
    
                handleSnackbarOpen('Deleted successfully'); 
            } catch (error) {
                console.error('Error deleting medication:', error);
            }
        }
    };    

    useEffect(() => {
        if (deleteSuccess) {
            handleSnackbarOpen('Deleted successfully');
            setDeleteSuccess(false); 
        }
    }, [deleteSuccess]);

    const handleEdit = (id) => {
        const medicationToEdit = medications.find(med => med.id === id);
        if (medicationToEdit) {
            setFormData({
                petId: medicationToEdit.pet_id, 
                name: medicationToEdit.name,
                dosage: medicationToEdit.dosage,
                description: medicationToEdit.description,
                startDate: medicationToEdit.start_date,
                endDate: medicationToEdit.end_date,
                sideEffects: medicationToEdit.side_effects,
                instructions: medicationToEdit.instructions,
                refill: medicationToEdit.refill ? 'yes' : 'no',
            });
            setSelectedMedicationId(id);
            handleOpen(); 
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Box sx={{ marginBottom: 2 }}>
                {pets.length === 0 && (
                <Alert 
                    severity="info" 
                    sx={{
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    }}
                >
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
                    to add a pet before adding a medication.
                </Alert>
                )}
            </Box>
            <Box sx={{ padding: '10px', marginBottom: '20px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', borderRadius: '6px' }}>
                <Typography variant="h4" align="left" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                    Current Medications
                </Typography>
            </Box>

            <Box sx={{ padding: '10px', marginBottom: '20px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', borderRadius: '6px' }}>
                <Typography variant="h6" align="left">To request a refill, contact: 704-XXX-XXXX</Typography>
            </Box>

            <Box sx={{ padding: '10px', marginBottom: '20px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
                onClick={pets.length > 0 ? handleOpen : null} 
                sx={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    marginRight: 1,
                    backgroundColor: pets.length === 0 ? 'primary.main' : 'primary.main', 
                    '&:hover': {
                        backgroundColor: pets.length === 0 ? 'primary.dark' : 'primary.dark',
                        opacity: pets.length === 0 ? 0.5 : 1, 
                    },
                    cursor: pets.length === 0 ? 'not-allowed' : 'pointer',
                }}
                aria-label="add medication"
            >
                <AddIcon sx={{ color: 'white' }} />
            </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
                    Report a Medication
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {loading ? (
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                ) : medications.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" sx={{ color: 'gray' }}>
                            No medications found. Click "Report a Medication" to add one!
                        </Typography>
                    </Grid>
                ) : (
                    medications.map((medication) => (  
                        <Grid item xs={12} key={medication.id}>
                            <Paper elevation={3} sx={{ padding: 2, position: 'relative' }}>
                            <IconButton
                                    onClick={() => handleEdit(medication.id)} 
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 50, 
                                    }}
                                    aria-label="edit medication"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleClickOpen(medication.id)} 
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                    }}
                                    aria-label="delete medication"
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <Typography variant="h6">{medication.name}</Typography>
                                <Typography variant="subtitle1" color="textSecondary">For Pet: {medication.pet_name}</Typography>
                                <Divider sx={{ margin: '10px 0', borderWidth: 1 }} />
                                <Typography variant="subtitle1">Dosage: {medication.dosage}</Typography>
                                <Typography variant="subtitle1">Description: {medication.description}</Typography>
                                <Typography variant="subtitle1">Start Date: {medication.start_date}</Typography>
                                <Typography variant="subtitle1">End Date: {medication.end_date ? medication.end_date : 'Ongoing'}</Typography>
                                <Typography variant="subtitle1">Side Effects: {medication.side_effects}</Typography>
                                <Typography variant="subtitle1">Instructions: {medication.instructions}</Typography>
                                <Typography variant="subtitle1">Refill: {medication.refill ? 'Yes' : 'No'}</Typography>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>


            
            <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: '8px', boxShadow: 24, width: '90%', maxWidth: '400px', overflowY: 'auto', maxHeight: '80%' }}>
                    <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                        Report a Medication
                    </Typography>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="pet-select-label">Select Pet</InputLabel>
                        <Select
                            labelId="pet-select-label"
                            name="petId"
                            value={formData.petId}
                            onChange={handleChange}
                            label="Select Pet"
                        >
                            {pets.map((pet) => (
                                <MenuItem key={pet.id} value={pet.id}>
                                    {pet.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Medication Name"
                        fullWidth
                        margin="normal"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Dosage"
                        fullWidth
                        margin="normal"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Side Effects"
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        name="sideEffects"
                        value={formData.sideEffects}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Instructions"
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />
                    <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                        <Typography component="legend">Refill Needed?</Typography>
                        <RadioGroup row value={formData.refill} onChange={handleChange} name="refill">
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
                <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this medication?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            await handleDelete();
                            setConfirmDeleteOpen(false); 
                        }}
                        color="primary"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}
            sx={{
                backgroundColor: 'primary.main', 
                color: 'white', 
            }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        </Box>
    );
};

export default Medications;