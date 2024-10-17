import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import React from 'react';

const Billing = () => {
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
        <Grid item xs={6}>
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
              Appointment Balance
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
              $XXX
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
            >
              <BookIcon sx={{ marginRight: 1 }} />
              <Typography sx={{ color: 'white' }}>
                View Balance Details
              </Typography>
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={6}>
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
              Medication Balance
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
              $XXX
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
            >
              <BookIcon sx={{ marginRight: 1 }} />
              <Typography sx={{ color: 'white' }}>
                View Balance Details
              </Typography>
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={6}>
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
              Vaccine Balance
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
              $XXX
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
            >
              <BookIcon sx={{ marginRight: 1 }} />
              <Typography sx={{ color: 'white' }}>
                View Balance Details
              </Typography>
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Billing;