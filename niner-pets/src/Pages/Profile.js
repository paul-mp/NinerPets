import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    Paper,
    Snackbar,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [pets, setPets] = useState([]); 
    const [exams, setExams] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                console.log("Token: ", token);
    
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
                    const errorDetails = await response.text();
                    throw new Error(`Failed to fetch user data: ${errorDetails}`);
                }
    
                const data = await response.json();
                setUserData({
                    name: data.username,
                    email: data.email,
                    id: data.id 
                });
    
                if (data.id) {
                    const petsResponse = await fetch(`http://localhost:5000/pets?user_id=${data.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!petsResponse.ok) {
                        throw new Error('Failed to fetch pets');
                    }
    
                    const petsData = await petsResponse.json();
                    setPets(petsData); 
                } else {
                    throw new Error('User ID is invalid');
                }
                if (data.id) {
                    const medicalRecordsResponse = await fetch(`http://localhost:5000/medicalrecords?user_id=${data.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!medicalRecordsResponse.ok) {
                        throw new Error('Failed to fetch medical records');
                    }
    
                    const medicalRecordsData = await medicalRecordsResponse.json();
                    
                    const examsData = medicalRecordsData.filter(record => record.record_type === 'exam');
                    setExams(examsData);
                    
                    const vaccinesData = medicalRecordsData.filter(record => record.record_type === 'vaccine');
                    setVaccines(vaccinesData); 
                    
                    const medicationsData = medicalRecordsData.filter(record => record.record_type === 'medication');
                    setMedications(medicationsData); 
                } else {
                    throw new Error('User ID is invalid');
                }
            } catch (error) {
                console.error('Error fetching user or pets data:', error);
                setSnackbarMessage('Error fetching data, please try again later.');
                setSnackbarOpen(true);
            } finally {
                setLoading(false); 
            }
        };
    
        fetchUserData();
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            {loading ? ( 
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            padding: '10px',
                            marginBottom: '10px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
                            borderRadius: '6px',
                            backgroundColor: '#ffffff'
                        }}
                        >
                        <Typography variant="h4">
                            Hi, {userData.name}!
                        </Typography>
                    </Box>
        
                    <Box
                        sx={{
                            padding: '10px',
                            marginBottom: '20px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
                            borderRadius: '6px',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <Typography variant="h4" >Profile</Typography>
                    </Box>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: 2, 
                            padding: 2, 
                            borderRadius: '6px', 
                            backgroundColor: '#ffffff', 
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
                            position: 'relative' 
                        }}
                        >
                        <PetsIcon 
                            sx={{ 
                                fontSize: 200, 
                                color: 'primary.main', 
                                marginRight: 2 
                            }} 
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                                {userData.name}
                            </Typography>
                            <Typography variant="body1">{userData.email}</Typography>
                        </Box>
                        <Box 
                            sx={{ 
                                position: 'absolute', 
                                bottom: 10, 
                                right: 10, 
                                display: 'flex', 
                                gap: 1 
                            }}
                        >
                            <Link to="/medications" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">
                                    Manage Medications
                                </Button>
                            </Link>
                            <Link to="/billing" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">
                                    View Billing Summary
                                </Button>
                            </Link>
                        </Box>
                    </Box>

                    <Box 
                        sx={{ 
                            padding: 2, 
                            borderRadius: '6px', 
                            backgroundColor: '#ffffff', 
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                            marginTop: 2,
                            position: 'relative'
                        }}
                    >
                        <Typography variant="h6">Your Pets:</Typography>
                        <Divider sx={{ marginTop: '10px', marginBottom: '20px', borderWidth: 1 }} />
                        <Box sx={{ marginTop: 1 }}>
                            {pets.length === 0 ? (
                                <Typography>No pets currently added to your account.</Typography>
                            ) : (
                                pets.map((pet, index) => (
                                    <Typography key={index}>• {pet.name}: {pet.species}</Typography>
                                ))
                            )}
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 10, right: 10,}}>
                            <Link to="/manage-pets" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary" sx={{ marginTop: 10 }}>
                                    Manage Pets
                                </Button>
                            </Link>
                        </Box>
                    </Box>
    
                    <Box 
                        sx={{ 
                            padding: 2, 
                            borderRadius: '6px', 
                            backgroundColor: '#ffffff', 
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                            marginTop: 2 
                        }}
                    >
                        <Typography variant="h6">Overview</Typography>
                        <Divider sx={{ marginY: 1 }} /> 
    
                        <Box sx={{ marginTop: 1 }}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    padding: 2, 
                                    borderRadius: '6px', 
                                    border: '1px solid', 
                                    borderColor: 'primary.main', 
                                    backgroundColor: '#ffffff', 
                                    marginBottom: 1
                                }}
                            >
                                <Typography variant="h6">Exams</Typography>
                                <Divider sx={{ margin: '5px 0', borderWidth: 1 }} />
                                <Box sx={{ marginTop: 1 }}>
                                    {exams.length === 0 ? (
                                        <Typography>No exams available for your pets.</Typography>
                                    ) : (
                                        <ul style={{ paddingLeft: '15px' }}>
                                            {exams.map((exam, index) => (
                                                <li key={exam.id} style={{ marginBottom: '8px' }}>
                                                    <Typography variant="body1">
                                                        {exam.name}: {exam.date}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Box>
                            </Paper>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    padding: 2, 
                                    borderRadius: '6px', 
                                    border: '1px solid', 
                                    borderColor: 'primary.main', 
                                    backgroundColor: '#ffffff', 
                                    marginBottom: 1,
                                }}
                            >
                                <Typography variant="h6">Vaccines</Typography>
                                <Divider sx={{ margin: '5px 0', borderWidth: 1 }} />
                                <Box sx={{ marginTop: 1 }}>
                                    {vaccines.length === 0 ? (
                                        <Typography>No vaccines available for your pets.</Typography>
                                    ) : (
                                        <ul style={{ paddingLeft: '20px' }}> 
                                            {vaccines.map((vaccine, index) => (
                                                <li key={vaccine.id} style={{ marginBottom: '8px' }}>
                                                    <Typography variant="body1">
                                                        {vaccine.name}: {vaccine.date}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Box>
                            </Paper>
                            
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    padding: 2, 
                                    borderRadius: '6px', 
                                    border: '1px solid', 
                                    borderColor: 'primary.main', 
                                    backgroundColor: '#ffffff', 
                                    marginBottom: 1 
                                }}
                            >
                                <Typography variant="h6">Medication Records</Typography>
                                <Divider sx={{ margin: '5px 0', borderWidth: 1 }} />
                                <Box sx={{ marginTop: 1 }}>
                                    {medications.length === 0 ? (
                                        <Typography>No medication records available for your pets.</Typography>
                                    ) : (
                                        <ul style={{ paddingLeft: '20px' }}> 
                                            {medications.map((medication, index) => (
                                                <li key={medication.id} style={{ marginBottom: '8px' }}>
                                                    <Typography variant="body1">
                                                        {medication.name}: {medication.date}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
    
                    <Snackbar 
                        open={snackbarOpen} 
                        autoHideDuration={6000} 
                        onClose={() => setSnackbarOpen(false)} 
                        message={snackbarMessage}
                    />
                </>
            )}
        </Box>
    );
}    

export default ProfilePage;