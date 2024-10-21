import { Box, Paper, Typography, Grid, Divider, CircularProgress } from '@mui/material'; 
import React, { useEffect, useState } from 'react';

const Vets = () => {
    const [vets, setVets] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

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
                setError('Error fetching vet data: ' + error.message);
            } finally {
                setLoading(false); 
            }
        };

        fetchVets();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Box 
                sx={{ 
                    padding: '10px', 
                    marginBottom: '20px', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                    borderRadius: '6px' 
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
                    Veterinarians
                </Typography>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : error ? ( 
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={3}>
                    {vets.map((vet) => (
                        <Grid item xs={12} key={vet.id}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6">{vet.name}</Typography>
                                <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                                <Typography variant="subtitle1">Specialty: {vet.specialty}</Typography>
                                <Typography variant="subtitle1">Information: {vet.information}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Vets;