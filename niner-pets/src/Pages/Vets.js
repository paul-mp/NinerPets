import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import React from 'react';

const Vets = () => {
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

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" id="dr-susan-farley">Dr. Susan Farley, DVM</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Specialty: Dog Vet</Typography>
                        <Typography variant="subtitle1">
                            Information: Dr. Farley has over 10 years of experience in veterinary medicine, focusing on comprehensive care for dogs of all breeds. Her dedication to animal health is matched only by her passion for educating pet owners about proper care and nutrition. Dr. Farley is known for her compassionate approach and commitment to her patients’ well-being.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" id="dr-colin-pace">Dr. Colin Pace, DVM</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Specialty: Cat Vet</Typography>
                        <Typography variant="subtitle1">
                            Information: Dr. Pace specializes in feline medicine, bringing a wealth of knowledge and a gentle touch to his practice. His dedication to improving the health of cats is evident in his thorough examinations and personalized treatment plans. Dr. Pace often shares his expertise with local shelters, helping to promote feline welfare in the community.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" id="dr-lean-zimmerman">Dr. Leah Zimmerman, DVM</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Specialty: Exotic Pets</Typography>
                        <Typography variant="subtitle1">
                            Information: Dr. Zimmerman is an expert in exotic animal care, providing specialized treatments for a variety of species, including reptiles, birds, and small mammals. With a deep understanding of the unique needs of exotic pets, she ensures that every animal receives the highest level of care. Dr. Zimmerman's dedication extends beyond her clinic as she advocates for responsible pet ownership and conservation efforts.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" id="dr-emily-carter">Dr. Emily Carter, DVM</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Specialty: Reptiles</Typography>
                        <Typography variant="subtitle1">
                            Information: Dr. Carter is a dedicated reptile veterinarian with extensive experience in treating various species, including snakes, lizards, and turtles. She focuses on preventive care, nutrition, and habitat management to ensure optimal health for her reptilian patients. Dr. Carter is passionate about educating owners on the proper care and husbandry of reptiles to enhance their quality of life.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Vets;