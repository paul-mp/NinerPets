import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Divider,
    IconButton,
    Snackbar,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManagePets = () => {
    const [loading, setLoading] = useState(true);
    const [openEditPet, setOpenEditPet] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [openAddPet, setOpenAddPet] = useState(false);
    const [petData, setPetData] = useState({
        name: '',
        species: '',
        otherSpecies: '',
        breed: '',
        dob: '',
        weight: ''
    });
    const [speciesOptions] = useState([
        'Dog', 'Cat', 'Bird', 'Reptile', 'Horse', 'Hamster', 'Fish', 'Other'
    ]);
    const [pets, setPets] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState(''); 
    const userId = "13"; 

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = () => {
        fetch(`http://localhost:5000/pets?user_id=${userId}`)
            .then(response => {
                console.log('Response Status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Pets Data:', data);
                setPets(data);
            })
            .catch(error => console.error('Error fetching pets:', error))
            .finally(() => setLoading(false));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        if (!petData.name || !petData.species || !petData.breed || !petData.dob || !petData.weight) {
            setSnackbarMessage('Please fill out all required fields.');
            setSnackbarOpen(true);
            return;
        }

        const petToAdd = {
            name: petData.name,
            species: petData.species === 'Other' ? petData.otherSpecies : petData.species,
            breed: petData.breed,
            dob: petData.dob,
            weight: petData.weight,
            user_id: userId
        };
    
        fetch('http://localhost:5000/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petToAdd),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            fetchPets(); 
            setOpenAddPet(false);
            resetPetData();
            setSuccessMessage('Pet created successfully!');
            setOpenSuccessDialog(true);
        })
        .catch(error => {
            console.error('Error adding pet:', error);
        });
    };

    const handleDeleteClick = (petId) => {
        setPetToDelete(petId);
        setConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        if (petToDelete) {
            fetch(`http://localhost:5000/pets/${petToDelete}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    setPets(prevPets => prevPets.filter(pet => pet.id !== petToDelete));
                    setSnackbarMessage('Pet deleted successfully!');
                    setSnackbarOpen(true);
                } else {
                    console.error('Error deleting pet:', response);
                }
            })
            .catch(error => {
                console.error('Error deleting pet:', error);
            })
            .finally(() => {
                setConfirmDelete(false);
                setPetToDelete(null);
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleUpdatePet = () => {
        if (!petData.name || !petData.species || !petData.breed || !petData.dob || !petData.weight) {
            setSnackbarMessage('Please fill out all required fields.');
            setSnackbarOpen(true);
            return;
        }

        const petToUpdate = {
            id: selectedPetId,
            name: petData.name,
            species: petData.species === 'Other' ? petData.otherSpecies : petData.species,
            breed: petData.breed,
            dob: petData.dob,
            weight: petData.weight,
            user_id: userId
        };
    
        fetch(`http://localhost:5000/pets/${selectedPetId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petToUpdate),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update pet');
            }
            return response.json();
        })
        .then(() => {
            fetchPets();
            setOpenEditPet(false);
            resetPetData();
            setSnackbarMessage('Pet updated successfully!');
            setSnackbarOpen(true);
        })
        .catch(error => {
            console.error('Error updating pet:', error);
            setSnackbarMessage('Error updating pet. Please try again.');
            setSnackbarOpen(true);
        });
    };

    const resetPetData = () => {
        setPetData({
            name: '',
            species: '',
            otherSpecies: '',
            breed: '',
            dob: '',
            weight: ''
        });
        setSelectedPetId('');
    };

    const handleSelectPet = (petId) => {
        setSelectedPetId(petId);
        const petToEdit = pets.find(pet => pet.id === petId);
        if (petToEdit) {
            setPetData({
                name: petToEdit.name,
                species: petToEdit.species,
                otherSpecies: petToEdit.species === 'Other' ? petToEdit.otherSpecies : '',
                breed: petToEdit.breed,
                dob: petToEdit.dob,
                weight: petToEdit.weight
            });
        }
    };

    const handleOpenEditPet = () => {
        if (!selectedPetId) {
            setSnackbarMessage('Please select a pet to edit.');
            setSnackbarOpen(true);
            return;
        }
        setOpenEditPet(true);
    };

    const handleEditIconClick = (petId) => {
        const petToEdit = pets.find(pet => pet.id === petId);
        if (petToEdit) {
            setPetData({
                name: petToEdit.name,
                species: petToEdit.species,
                otherSpecies: petToEdit.species === 'Other' ? petToEdit.otherSpecies : '',
                breed: petToEdit.breed,
                dob: petToEdit.dob,
                weight: petToEdit.weight
            });
            setSelectedPetId(petId); 
            setOpenEditPet(true); 
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2, minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Box 
                sx={{ 
                    padding: '10px', 
                    marginBottom: '20px', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                    borderRadius: '6px', 
                    backgroundColor: '#ffffff' 
                }}
            >
                <Typography 
                    variant="h4" 
                    align="left" 
                    sx={{ 
                        marginBottom: 2, 
                        fontWeight: 'bold' 
                    }} 
                >
                    Manage Pets
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12}> 
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => setOpenAddPet(true)} 
                        fullWidth
                        sx={{ 
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            padding: '10px', 
                        }}
                    >
                        Add a Pet
                    </Button>
                </Grid>
            </Grid>

            <Box mt={2}>
                {loading ? (
                    <CircularProgress />
                ) : pets.length === 0 ? (
                    <Typography variant="h6" align="center" sx={{ marginTop: 4, color: 'gray' }}>
                        No pets found. Click "Add a Pet" to get started!
                    </Typography>
                ) : (
                    pets.map((pet) => (
                        <Card key={pet.id} variant="outlined" style={{ marginBottom: '10px', position: 'relative', boxShadow: 10 }}>
                            <CardContent>
                                <Typography variant="h6">{pet.name}</Typography>
                                <Divider style={{ margin: '8px 0' }} />
                                <Typography variant="body2">Species: {pet.species}</Typography>
                                <Typography variant="body2">Breed: {pet.breed}</Typography>
                                <Typography variant="body2">Date of Birth: {pet.dob}</Typography>
                                <Typography variant="body2">Weight: {pet.weight} lbs</Typography>
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <IconButton
                                        onClick={() => handleEditIconClick(pet.id)}  
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteClick(pet.id)} 
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />

            <Dialog open={openAddPet} onClose={() => setOpenAddPet(false)}>
                <DialogTitle>Add a Pet</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={petData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        select
                        margin="dense"
                        name="species"
                        label="Species"
                        fullWidth
                        value={petData.species}
                        onChange={handleInputChange}
                    >
                        {speciesOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    {petData.species === 'Other' && (
                        <TextField
                            margin="dense"
                            name="otherSpecies"
                            label="Other Species"
                            fullWidth
                            value={petData.otherSpecies}
                            onChange={handleInputChange}
                        />
                    )}
                    <TextField
                        margin="dense"
                        name="breed"
                        label="Breed"
                        fullWidth
                        value={petData.breed}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="dob"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={petData.dob}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="weight"
                        label="Weight (lbs)"
                        type="number"
                        fullWidth
                        value={petData.weight}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddPet(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add Pet</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditPet} onClose={() => setOpenEditPet(false)}>
                <DialogTitle>Edit Pet</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={petData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        select
                        margin="dense"
                        name="species"
                        label="Species"
                        fullWidth
                        value={petData.species}
                        onChange={handleInputChange}
                    >
                        {speciesOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    {petData.species === 'Other' && (
                        <TextField
                            margin="dense"
                            name="otherSpecies"
                            label="Other Species"
                            fullWidth
                            value={petData.otherSpecies}
                            onChange={handleInputChange}
                        />
                    )}
                    <TextField
                        margin="dense"
                        name="breed"
                        label="Breed"
                        fullWidth
                        value={petData.breed}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="dob"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={petData.dob}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="weight"
                        label="Weight (lbs)"
                        type="number"
                        fullWidth
                        value={petData.weight}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditPet(false)}>Cancel</Button>
                    <Button onClick={handleUpdatePet}>Update Pet</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this pet?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>{successMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSuccessDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManagePets;