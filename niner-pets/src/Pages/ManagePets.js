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
import CloseIcon from '@mui/icons-material/Close';

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
    const userId = "1"; 

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
        // Validate that all required fields are filled
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
        console.log(`Delete button clicked for pet ID: ${petId}`);
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

    return (
        <Box sx={{ flexGrow: 1, padding: 2, minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            {/* Header Box */}
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

            {/* Buttons in Separate Boxes */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box 
                        sx={{ 
                            padding: '10px', 
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                            borderRadius: '6px', 
                            backgroundColor: '#ffffff' 
                        }}
                    >
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => setOpenAddPet(true)} 
                            fullWidth
                        >
                            Add a Pet
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box 
                        sx={{ 
                            padding: '10px', 
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                            borderRadius: '6px', 
                            backgroundColor: '#ffffff' 
                        }}
                    >
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            fullWidth
                            onClick={() => setOpenEditPet(true)} 
                        >
                            Edit Pet
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Added Pets List */}
            <Box sx={{ marginTop: '20px' }}>
                {loading ? (
                    <CircularProgress /> 
                ) : (
                pets.length > 0 ? (
                    pets.map(pet => (
                        <Card 
                            key={pet.id} 
                            sx={{ marginBottom: '10px', backgroundColor: '#ffffff', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}
                        >
                            <CardContent>
                                <Typography variant="h6">{pet.name}</Typography>
                                <Typography variant="body2">Species: {pet.species}</Typography>
                                <Typography variant="body2">Breed: {pet.breed}</Typography>
                                <Typography variant="body2">DOB: {pet.dob}</Typography>
                                <Typography variant="body2">Weight: {pet.weight} lbs</Typography>
                            </CardContent>
                            <Divider />
                            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton color="primary" onClick={() => handleDeleteClick(pet.id)}>
                                    <CloseIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))
            ) : (
                <Typography>No pets added yet.</Typography>
            )
        )}
            </Box>

            {/* Add Pet Dialog */}
            <Dialog open={openAddPet} onClose={() => setOpenAddPet(false)}>
                <DialogTitle>Add a New Pet</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={petData.name}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                    />
                    <TextField
                        select
                        label="Species"
                        name="species"
                        value={petData.species}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    >
                        {speciesOptions.map(species => (
                            <MenuItem key={species} value={species}>
                                {species}
                            </MenuItem>
                        ))}
                    </TextField>
                    {petData.species === 'Other' && (
                        <TextField
                            label="Other Species"
                            type="text"
                            fullWidth
                            name="otherSpecies"
                            value={petData.otherSpecies}
                            onChange={handleInputChange}
                            required
                            margin="dense"
                        />
                    )}
                    <TextField
                        label="Breed"
                        type="text"
                        fullWidth
                        name="breed"
                        value={petData.breed}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        name="dob"
                        value={petData.dob}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Weight (lbs)"
                        type="number"
                        fullWidth
                        name="weight"
                        value={petData.weight}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                        inputProps={{ min: 0, max: 50000 }} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddPet(false)} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add Pet</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Pet Dialog */}
            <Dialog
                open={openEditPet}
                onClose={() => setOpenEditPet(false)}
                fullWidth
            >
                <DialogTitle>Edit Pet</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Select Pet"
                        value={selectedPetId}
                        onChange={(e) => handleSelectPet(e.target.value)} 
                        required
                        fullWidth
                         margin="dense"
                    >
                        <MenuItem value="">
                            <em>Select a pet</em>
                        </MenuItem>
                        {pets.map(pet => (
                            <MenuItem key={pet.id} value={pet.id}>
                                {pet.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={petData.name}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                    />
                    <TextField
                        select
                        label="Species"
                        name="species"
                        value={petData.species}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    >
                        {speciesOptions.map(species => (
                            <MenuItem key={species} value={species}>
                                {species}
                            </MenuItem>
                        ))}
                    </TextField>
                    {petData.species === 'Other' && (
                        <TextField
                            label="Other Species"
                            type="text"
                            fullWidth
                            name="otherSpecies"
                            value={petData.otherSpecies}
                            onChange={handleInputChange}
                            required
                            margin="dense"
                        />
                    )}
                    <TextField
                        label="Breed"
                        type="text"
                        fullWidth
                        name="breed"
                        value={petData.breed}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        name="dob"
                        value={petData.dob}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Weight (lbs)"
                        type="number"
                        fullWidth
                        name="weight"
                        value={petData.weight}
                        onChange={handleInputChange}
                        required
                        margin="dense"
                        inputProps={{ min: 0, max: 50000 }} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditPet(false)} color="primary">Cancel</Button>
                    <Button onClick={handleUpdatePet} color="primary">Update Pet</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                message={snackbarMessage}
            />

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this pet?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog for Adding/Updating Pets */}
            <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>{successMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSuccessDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManagePets;