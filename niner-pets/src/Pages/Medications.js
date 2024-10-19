import { Box, Paper, Typography, Grid, Divider, IconButton, Modal, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

const Medications = () => {
    const [open, setOpen] = useState(false); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false); 

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
                    Current Medications
                </Typography>
            </Box>

            <Box 
                sx={{ 
                    padding: '10px', 
                    marginBottom: '20px', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                    borderRadius: '6px' 
                }}
            >
                <Typography 
                    variant="h6" 
                    align="left"
                >
                    To request a refill, contact: 704-XXX-XXXX
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Apoquel 16mg</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Dosage: 1 tablet</Typography>
                        <Typography variant="subtitle1">
                            Description: Apoquel is an anti-itch medication used to control itching associated with allergic skin conditions in dogs.
                        </Typography>
                        <Typography variant="subtitle1">Start Date: January 1, 2024</Typography>
                        <Typography variant="subtitle1">End Date: Ongoing</Typography>
                        <Typography variant="subtitle1">
                            Side Effects: May include vomiting, diarrhea, lethargy, or decreased appetite.
                        </Typography>
                        <Typography variant="subtitle1">
                            Instructions: Administer one tablet orally every 12 hours for the first 14 days, then switch to once daily.
                        </Typography>
                        <Typography variant="subtitle1">Refill: Yes</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Galliprant 20mg</Typography>
                        <Divider sx={{ margin: '10px 0', borderWidth: 1 }} /> 
                        <Typography variant="subtitle1">Dosage: 1 tablet</Typography>
                        <Typography variant="subtitle1">
                            Description: Galliprant is a non-steroidal anti-inflammatory drug (NSAID) used to relieve pain and inflammation associated with osteoarthritis in dogs.
                        </Typography>
                        <Typography variant="subtitle1">Start Date: February 15, 2024</Typography>
                        <Typography variant="subtitle1">End Date: Ongoing</Typography>
                        <Typography variant="subtitle1">
                            Side Effects: Possible side effects include vomiting, diarrhea, decreased appetite, or lethargy.
                        </Typography>
                        <Typography variant="subtitle1">
                            Instructions: Administer one tablet orally once daily, with or without food.
                        </Typography>
                        <Typography variant="subtitle1">Refill: No</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box 
                sx={{ 
                    padding: '10px', 
                    marginTop: '20px', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}
            >
                <IconButton 
                    onClick={handleOpen} 
                    sx={{ 
                        borderRadius: '50%', 
                        width: '40px', 
                        height: '40px', 
                        marginRight: 1, 
                        backgroundColor: 'primary.main', 
                        '&:hover': {
                            backgroundColor: 'primary.dark', 
                        }
                    }}
                    aria-label="add medication"
                >
                    <AddIcon sx={{ color: 'white' }} />
                </IconButton>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main', 
                        textAlign: 'center' 
                    }} 
                >
                    Report a Medication
                </Typography>
            </Box>

            <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ 
                    backgroundColor: 'white', 
                    padding: 2, 
                    borderRadius: '8px', 
                    boxShadow: 24, 
                    width: '90%', 
                    maxWidth: '400px', 
                    overflowY: 'auto', 
                    maxHeight: '80%', 
                }}>
                    <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                        Report a Medication
                    </Typography>
                    
                    <TextField 
                        label="Medication Name" 
                        fullWidth 
                        margin="normal" 
                    />
                    <TextField 
                        label="Dosage" 
                        fullWidth 
                        margin="normal" 
                    />
                    <TextField 
                        label="Description" 
                        fullWidth 
                        multiline 
                        rows={2} 
                        margin="normal" 
                    />
                    <TextField 
                        label="Start Date" 
                        type="date" 
                        fullWidth 
                        margin="normal" 
                        InputLabelProps={{ shrink: true }} 
                    />
                    <TextField 
                        label="End Date" 
                        type="date" 
                        fullWidth 
                        margin="normal" 
                        InputLabelProps={{ shrink: true }} 
                    />
                    <TextField 
                        label="Side Effects" 
                        fullWidth 
                        multiline 
                        rows={2} 
                        margin="normal" 
                    />
                    <TextField 
                        label="Instructions" 
                        fullWidth 
                        multiline 
                        rows={2} 
                        margin="normal" 
                    />
                    
                    <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                        <Typography variant="subtitle1">Refill:</Typography>
                        <RadioGroup row aria-label="refill" name="refill">
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button onClick={handleClose} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                            Submit
                        </Button>
                        <Button onClick={handleClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Medications;