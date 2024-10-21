import { Box, Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import React, { useState } from 'react';

const Billing = () => {
  const [open, setOpen] = useState(false);
  const [balanceType, setBalanceType] = useState('');

  const handleClickOpen = (type) => {
    setBalanceType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBalanceType('');
  };

  // Sample balance details
  const balanceDetails = {
    Appointment: {
      amountDue: '$125.00',
      details: [
        { date: '2024-10-01', description: 'Vet Visit', amount: '$50.00' },
        { date: '2024-10-15', description: 'Dental Checkup', amount: '$75.00' },
      ],
    },
    Medication: {
      amountDue: '$50.00',
      details: [
        { name: 'Apoquel 16mg', amount: '$25.00' },
        { name: 'Galliprant 20mg', amount: '$25.00' },
      ],
    },
    Vaccine: {
      amountDue: '$40.00',
      details: [
        { name: 'Rabies Vaccine', amount: '$15.00' },
        { name: 'Distemper Vaccine', amount: '$25.00' },
      ],
    },
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box 
        sx={{ 
          padding: '10px', 
          marginBottom: '0px', 
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
          Billing Summary
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ marginTop: 0 }}> 
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
              <Typography variant="h5" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Amount Due:
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  color: 'primary.main' 
                }}
              >
                {balanceDetails[type]?.amountDue}
              </Typography>
              <hr style={{ 
                margin: '20px 0', 
                border: '0.5px solid black', 
                width: 'calc(100% + 32px)',
                position: 'relative',
                left: '-16px',
              }} />
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center' }}
                onClick={() => handleClickOpen(type)}
              >
                <BookIcon sx={{ marginRight: 1 }} />
                <Typography sx={{ color: 'white' }}>
                  View Balance Details
                </Typography>
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Balance Details */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{balanceType} Balance Details</DialogTitle>
        <DialogContent>
          {balanceDetails[balanceType]?.details.map((item, index) => (
            <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
              {balanceType === 'Appointment'
                ? `${item.date}: ${item.description} - ${item.amount}`
                : `${item.name} - ${item.amount}`}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing;