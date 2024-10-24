import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Avatar,
    IconButton,
    Divider,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'; 

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        name: 'Your Name',
        email: 'your.email@example.com',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleEditName = () => {
        setSnackbarMessage('Edit name functionality not implemented yet.');
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box 
                sx={{ 
                    padding: '10px', 
                    marginBottom: '20px', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                    borderRadius: '6px', 
                    backgroundColor: '#ffffff' 
                }}
            >
                <Typography variant="h4">Profile</Typography>
            </Box>

            {/* Profile Section with White Box */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 2, 
                    padding: 2, 
                    borderRadius: '6px', 
                    backgroundColor: '#ffffff', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)' 
                }}
            >
                <Avatar 
                    sx={{ 
                        width: 200, 
                        height: 200, 
                        marginRight: 2, 
                        bgcolor: 'primary.main' 
                    }} 
                >
                    {userData.name.charAt(0)} 
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                        {userData.name}
                        <IconButton onClick={handleEditName} sx={{ marginLeft: 1 }}>
                            <EditIcon/>
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">{userData.email}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
                    <Link to="/medications" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" sx={{ marginBottom: 1 }}>
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
                    marginTop: 2 
                }}
            >
                <Typography variant="h6">Your Pets:</Typography>
                <Box sx={{ marginTop: 1 }}>
                    <Typography>No pets currently added to your account.</Typography>
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
                        <Typography variant="body1" color="textSecondary">
                            <span style={{ color: 'primary.main' }}>&bull;</span> 
                            <span style={{ fontSize: '1.1rem' }}> Up to date</span>
                        </Typography>
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
                        <Typography variant="body1" color="textSecondary">
                            <span style={{ color: 'primary.main' }}>&bull;</span> 
                            <span style={{ fontSize: '1.1rem' }}> Up to date</span>
                        </Typography>
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
                        <Typography variant="h6">Appointments</Typography>
                        <Typography variant="body1" color="textSecondary">
                            <span style={{ color: 'primary.main' }}>&bull;</span> 
                            <span style={{ fontSize: '1.1rem' }}> Up to date</span>
                        </Typography>
                    </Paper>
                </Box>
            </Box>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={() => setSnackbarOpen(false)} 
                message={snackbarMessage}
            />
        </Box>
    );
};

export default ProfilePage;
