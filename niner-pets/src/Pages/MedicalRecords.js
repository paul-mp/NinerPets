import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert,
  } from '@mui/material';
  import BookIcon from '@mui/icons-material/Book';
  import { List, ListItem, ListItemText } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import React, { useState, useEffect } from 'react';
  
  const MedicalRecords = () => {
    const userId = 13; // Hardcoded for now; you might want to get this from a context or props
    const [open, setOpen] = useState(false);
    const [recordType, setRecordType] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedVet, setSelectedVet] = useState(''); // Added selectedVet
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [medicalData, setMedicalData] = useState([]);
    const [message, setMessage] = useState('');
    const [viewDetailsType, setViewDetailsType] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [loadingVets, setLoadingVets] = useState(false); // Added loadingVets
    const [errorVets, setErrorVets] = useState(null); // Added error handling for vets
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setDetailsOpen(false);
      setRecordType('');
      setSelectedPet('');
      setSelectedVet(''); // Reset selectedVet
      setDescription('');
      setDate('');
      setMessage('');
    };
  
    // Fetch medical records data
    const fetchMedicalData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/medicalrecords?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setMedicalData(data);
        } else {
          console.error('Failed to fetch medical records data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching medical records data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch pets data
    useEffect(() => {
      const fetchPets = async () => {
        const response = await fetch(`http://localhost:5000/pets?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else {
          console.error("Failed to fetch pets:", response.status);
        }
      };
  
      fetchPets();
      fetchMedicalData();
    }, [userId]);
  
    // Fetch vets data
    useEffect(() => {
      const fetchVets = async () => {
        setLoadingVets(true);
        try {
          const response = await fetch('http://localhost:5000/vets');
          if (response.ok) {
            const data = await response.json();
            setVets(data);
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          setErrorVets('Error fetching veterinarians. Please try again later.');
          console.error('Error fetching vets:', error);
        } finally {
          setLoadingVets(false);
        }
      };
  
      fetchVets();
    }, []);
  
    // Add new medical record
    const handleAddRecord = async () => {
      if (!selectedPet || !recordType || !selectedVet || !description || !date) {
        setSnackbarMessage('All fields are required!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/medicalrecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            pet_id: selectedPet,
            vet_id: selectedVet,
            type: recordType,
            description,
            date,
          }),
        });
  
        if (response.ok) {
          const newEntry = await response.json();
          setMedicalData((prevData) => [...prevData, newEntry]);
          handleClose();
          setSnackbarMessage('Medical record added successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          const errorResponse = await response.text();
          console.error("Failed to add medical record:", response.status, errorResponse);
          setSnackbarMessage('Failed to add medical record.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error occurred while adding medical record:", error);
        setSnackbarMessage('Error occurred while adding medical record.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
  
    // View details of a specific type
    const handleViewDetails = (type) => {
      setViewDetailsType(type);
      setDetailsOpen(true);
    };
  
    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box
          sx={{
            padding: '10px',
            marginBottom: '20px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            borderRadius: '6px',
          }}
        >
          <Typography variant="h4" align="left" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            Medical Records
          </Typography>
        </Box>
  
        {/* Add Medical Record Section */}
        <Box
          sx={{
            padding: '10px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={handleClickOpen}
            sx={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              marginRight: 1,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            aria-label="add record"
          >
            <AddIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
            Add a Medical Record
          </Typography>
        </Box>
  
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '0 auto', marginTop: 2 }} />
        ) : (
          <Grid container spacing={3} sx={{ marginTop: 0 }}>
            {/* Medical Record Types */}
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
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {type} Records
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center' }}
                    onClick={() => handleViewDetails(type)}
                  >
                    <BookIcon sx={{ marginRight: 1 }} />
                    <Typography sx={{ color: 'white' }}>View {type} Details</Typography>
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
  
        {/* Dialog for Adding a Record */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Add Medical Record
            </Typography>
  
            {/* Pet Selection Dropdown */}
            <TextField
              select
              label="Select a Pet"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              required
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              {pets.map((pet) => (
                <MenuItem key={pet.id} value={pet.id}>
                  {pet.name}
                </MenuItem>
              ))}
            </TextField>
  
            {/* Record Type Dropdown */}
            <TextField
              select
              label="Record Type"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              required
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="Appointment">Appointment</MenuItem>
              <MenuItem value="Medication">Medication</MenuItem>
              <MenuItem value="Vaccine">Vaccine</MenuItem>
            </TextField>
  
            {/* Vet Selection Dropdown */}
            <TextField
              select
              label="Select a Veterinarian"
              value={selectedVet}
              onChange={(e) => setSelectedVet(e.target.value)}
              required
              fullWidth
              sx={{ marginBottom: 2 }}
              disabled={loadingVets}
            >
              {loadingVets ? (
                <MenuItem disabled>Loading veterinarians...</MenuItem>
              ) : (
                vets.map((vet) => (
                  <MenuItem key={vet.id} value={vet.id}>
                    {vet.name}
                  </MenuItem>
                ))
              )}
            </TextField>
  
            {/* Date and Description Inputs */}
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddRecord} variant="contained" color="primary">
              Add Record
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Snackbar for Notifications */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
  
        {/* View Details Dialog */}
        <Dialog open={detailsOpen} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {viewDetailsType} Records
            </Typography>
            <List>
              {medicalData
                .filter((record) => record.type === viewDetailsType)
                .map((record, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Date: ${record.date} - Description: ${record.description}`}
                    />
                  </ListItem>
                ))}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  
  export default MedicalRecords;
  
  


// import {
//     Box,
//     Button,
//     Grid,
//     Paper,
//     Typography,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     IconButton,
//     TextField,
//     MenuItem,
//     InputAdornment,
//     CircularProgress,
//     Snackbar,
//     Alert,
//   } from '@mui/material';
//   import BookIcon from '@mui/icons-material/Book';
//   import AddIcon from '@mui/icons-material/Add';
//   import DeleteIcon from '@mui/icons-material/Delete';
//   import EditIcon from '@mui/icons-material/Edit';
//   import React, { useState, useEffect } from 'react';
  
//   const MedicalRecords = () => {
//     const [open, setOpen] = useState(false); // For Add Record Dialog
//     const [selectedRecord, setSelectedRecord] = useState({});
//     const [vets, setVets] = useState([]); // List of veterinarians
//     const [loadingVets, setLoadingVets] = useState(false);
//     const [errorVets, setErrorVets] = useState('');
    
//     // Form States
//     const [type, setType] = useState('');
//     const [eventName, setEventName] = useState('');
//     const [date, setDate] = useState('');
//     const [description, setDescription] = useState('');
//     const [doctor, setDoctor] = useState('');
    
//     // Snackbar States
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
//     // Loading State for Adding Record
//     const [addingRecord, setAddingRecord] = useState(false);
    
//     // Fetch Vets
//     useEffect(() => {
//       const fetchVets = async () => {
//         setLoadingVets(true);
//         try {
//           const response = await fetch('http://localhost:5000/vets'); // Flask API endpoint
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           const data = await response.json();
//           setVets(data);
//         } catch (error) {
//           setErrorVets('Error fetching veterinarians. Please try again later.');
//           console.error('Error fetching vets:', error);
//         } finally {
//           setLoadingVets(false);
//         }
//       };
  
//       fetchVets();
//     }, []);
    
//     // Existing Medical Records Data
//     const [medicalRecords, setMedicalRecords] = useState({
//       Immunization: [
//         {
//           name: 'Rabies Vaccine',
//           date: '08/10/2024',
//           description:
//             'The Rabies vaccine is a crucial vaccine to prevent rabies, a highly dangerous and often fatal viral disease that can be transmitted to humans through bites. Pets are required by law to be vaccinated in most states. Booster shots are typically required annually or every three years, depending on the vaccine.',
//           doctor: 'Dr. John Doe',
//         },
//         // ... other records
//       ],
//       Medication: [
//         {
//           name: 'Heartgard Plus',
//           date: '09/15/2024',
//           description:
//             'Heartgard Plus is a monthly oral medication that prevents heartworm infection in dogs. It also protects against roundworms and hookworms, which can cause gastrointestinal issues. This medication should be administered year-round, even in winter months, to maintain full protection.',
//           doctor: 'Dr. John Doe',
//         },
//         // ... other records
//       ],
//       Appointments: [
//         {
//           name: 'Annual Wellness Exam',
//           date: '07/10/2024',
//           description:
//             'The annual wellness exam is a comprehensive check-up to evaluate the overall health of the pet. During this exam, the vet checks for any signs of illness, updates vaccinations, and discusses preventive care such as dental cleanings, parasite control, and weight management.',
//           doctor: 'Dr. John Doe',
//         },
//         // ... other records
//       ],
//     });
  
//     // Handle Opening the Add Record Dialog
//     const handleAddOpen = () => {
//       setOpen(true);
//     };
  
//     // Handle Closing the Add Record Dialog
//     const handleAddClose = () => {
//       setOpen(false);
//       // Reset form fields
//       setType('');
//       setEventName('');
//       setDate('');
//       setDescription('');
//       setDoctor('');
//     };
  
//     // Handle Submitting the New Medical Record
//     const handleAddRecord = async () => {
//       // Basic Validation
//       if (!type || !eventName || !date || !description || !doctor) {
//         setSnackbarMessage('All fields are required!');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//         return;
//       }
  
//       setAddingRecord(true);
//       try {
//         const response = await fetch('http://localhost:5000/medicalrecords', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             type,
//             name: eventName,
//             date,
//             description,
//             doctor,
//           }),
//         });
  
//         if (response.ok) {
//           const newRecord = await response.json();
//           setMedicalRecords((prevRecords) => {
//             const updatedRecords = { ...prevRecords };
//             if (!updatedRecords[type]) {
//               updatedRecords[type] = [];
//             }
//             updatedRecords[type].push(newRecord);
//             return updatedRecords;
//           });
//           handleAddClose();
//           setSnackbarMessage('Medical record added successfully!');
//           setSnackbarSeverity('success');
//           setSnackbarOpen(true);
//         } else {
//           const errorResponse = await response.text();
//           console.error('Failed to add medical record:', response.status, errorResponse);
//           setSnackbarMessage('Failed to add medical record.');
//           setSnackbarSeverity('error');
//           setSnackbarOpen(true);
//         }
//       } catch (error) {
//         console.error('Error adding medical record:', error);
//         setSnackbarMessage('Error occurred while adding medical record.');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//       } finally {
//         setAddingRecord(false);
//       }
//     };
  
//     // Handle Viewing Record Details (Existing Functionality)
//     const handleClickOpen = (record) => {
//       setSelectedRecord(record);
//       setOpen(true);
//     };
  
//     const handleClose = () => {
//       setOpen(false);
//       setSelectedRecord({});
//     };
  
//     return (
//       <Box sx={{ flexGrow: 1, padding: 2 }}>
//         {/* Header Section */}
//         <Box
//           sx={{
//             padding: '10px',
//             marginBottom: '20px',
//             boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
//             borderRadius: '6px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Typography
//             variant="h4"
//             align="left"
//             sx={{
//               fontWeight: 'bold',
//             }}
//           >
//             Medical Records
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleAddOpen}
//           >
//             Add New Record
//           </Button>
//         </Box>
  
//         {/* Medical Records Grid */}
//         <Grid container spacing={3}>
//           {['Immunization', 'Appointments', 'Medication'].map((typeCategory) => (
//             <Grid item xs={12} md={4} key={typeCategory}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   padding: 2,
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                 }}
//               >
//                 <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
//                   {typeCategory}
//                 </Typography>
//                 <Box sx={{ flexGrow: 1 }}>
//                   {medicalRecords[typeCategory]?.map((record, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         marginBottom: 2,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
//                         {record.name}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'gray', marginRight: 2 }}>
//                         {record.date}
//                       </Typography>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{ display: 'flex', alignItems: 'center' }}
//                         onClick={() => handleClickOpen(record)}
//                       >
//                         <BookIcon sx={{ marginRight: 1 }} />
//                         <Typography sx={{ color: 'white' }}>View More</Typography>
//                       </Button>
//                     </Box>
//                   ))}
//                 </Box>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
  
//         {/* Dialog for Medical Record Details */}
//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//           <DialogTitle>{selectedRecord.name}</DialogTitle>
//           <DialogContent>
//             <Typography variant="body1" sx={{ marginBottom: 1 }}>
//               Date: {selectedRecord.date}
//             </Typography>
//             <Typography variant="body2" sx={{ marginBottom: 1 }}>
//               {selectedRecord.description}
//             </Typography>
//             <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
//               Doctor: {selectedRecord.doctor}
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
  
//         {/* Dialog for Adding New Medical Record */}
//         <Dialog open={open} onClose={handleAddClose} fullWidth maxWidth="sm">
//           <DialogTitle>Add New Medical Record</DialogTitle>
//           <DialogContent>
//             {/* Type Selection */}
//             <TextField
//               select
//               label="Type"
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               required
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             >
//               <MenuItem value="Immunization">Immunization</MenuItem>
//               <MenuItem value="Medication">Medication</MenuItem>
//               <MenuItem value="Appointments">Appointments</MenuItem>
//             </TextField>
  
//             {/* Name of Event */}
//             <TextField
//               label="Name of Event"
//               value={eventName}
//               onChange={(e) => setEventName(e.target.value)}
//               required
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />
  
//             {/* Date Picker */}
//             <TextField
//               label="Date"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//               fullWidth
//               sx={{ marginBottom: 2 }}
//               InputLabelProps={{ shrink: true }}
//             />
  
//             {/* Description */}
//             <TextField
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//               fullWidth
//               multiline
//               rows={4}
//               sx={{ marginBottom: 2 }}
//             />
  
//             {/* Doctor Selection */}
//             {loadingVets ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
//                 <CircularProgress size={24} />
//               </Box>
//             ) : errorVets ? (
//               <Typography color="error" sx={{ marginBottom: 2 }}>
//                 {errorVets}
//               </Typography>
//             ) : (
//               <TextField
//                 select
//                 label="Doctor"
//                 value={doctor}
//                 onChange={(e) => setDoctor(e.target.value)}
//                 required
//                 fullWidth
//                 sx={{ marginBottom: 2 }}
//               >
//                 {vets.map((vet) => (
//                   <MenuItem key={vet.id} value={vet.name}>
//                     {vet.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleAddClose} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleAddRecord} color="primary" disabled={addingRecord}>
//               {addingRecord ? <CircularProgress size={24} /> : 'Add'}
//             </Button>
//           </DialogActions>
//         </Dialog>
  
//         {/* Snackbar for Notifications */}
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={6000}
//           onClose={() => setSnackbarOpen(false)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         >
//           <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>
//       </Box>
//     );
//   };
  
//   export default MedicalRecords;



// working test^^








// import { Box, Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import BookIcon from '@mui/icons-material/Book';
// import React, { useState } from 'react';

// const MedicalRecords = () => {
//     const [open, setOpen] = useState(false);
//     const [selectedRecord, setSelectedRecord] = useState({});

//     const handleClickOpen = (record) => {
//         setSelectedRecord(record);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setSelectedRecord({});
//     };

//     // Sample pet medical record details with longer descriptions and doctor info
//     const medicalRecords = {
//         Immunization: [
//             {
//                 name: 'Rabies Vaccine',
//                 date: '08/10/2024',
//                 description: 'The Rabies vaccine is a crucial vaccine to prevent rabies, a highly dangerous and often fatal viral disease that can be transmitted to humans through bites. Pets are required by law to be vaccinated in most states. Booster shots are typically required annually or every three years, depending on the vaccine.',
//                 doctor: 'Dr. John Doe',
//             },
//             {
//                 name: 'Distemper Vaccine',
//                 date: '07/05/2024',
//                 description: 'The Distemper vaccine protects against a contagious and serious viral illness that affects multiple systems in dogs. The vaccine is typically given in combination with other core vaccines. It is administered as part of a series of vaccines in young puppies and continues with booster shots throughout the dog’s life.',
//                 doctor: 'Dr. Sarah Smith',
//             },
//             {
//                 name: 'Bordetella Vaccine',
//                 date: '06/20/2024',
//                 description: 'This vaccine protects against Bordetella bronchiseptica, a bacterium that causes kennel cough. The vaccine is recommended for dogs who are frequently boarded, visit dog parks, or are exposed to other dogs often. It helps prevent the highly contagious respiratory illness, especially in social environments.',
//                 doctor: 'Dr. Emily Brown',
//             },
//             {
//                 name: 'Leptospirosis Vaccine',
//                 date: '06/01/2024',
//                 description: 'Leptospirosis is a bacterial infection spread through the urine of infected animals, especially in areas with standing water. The vaccine protects pets from this potentially deadly infection, which can also affect humans. It is an important consideration for pets that spend time outdoors or in rural areas.',
//                 doctor: 'Dr. Michael Green',
//             },
//         ],
//         Medication: [
//             {
//                 name: 'Heartgard Plus',
//                 date: '09/15/2024',
//                 description: 'Heartgard Plus is a monthly oral medication that prevents heartworm infection in dogs. It also protects against roundworms and hookworms, which can cause gastrointestinal issues. This medication should be administered year-round, even in winter months, to maintain full protection.',
//                 doctor: 'Dr. John Doe',
//             },
//             {
//                 name: 'Bravecto Chewable',
//                 date: '09/01/2024',
//                 description: 'Bravecto is a chewable tablet given to dogs to prevent flea infestations and kill ticks for up to 12 weeks. It works quickly and provides long-lasting protection, making it convenient for pet owners who prefer fewer doses. It’s especially recommended in areas with a high risk of tick-borne diseases.',
//                 doctor: 'Dr. Sarah Smith',
//             },
//             {
//                 name: 'Apoquel 16mg',
//                 date: '08/20/2024',
//                 description: 'Apoquel is used to control itching and inflammation caused by allergic skin conditions in dogs. It provides rapid relief and can be used long-term under veterinary supervision. This medication is often used for dogs with chronic atopic dermatitis, environmental allergies, or food sensitivities.',
//                 doctor: 'Dr. Emily Brown',
//             },
//             {
//                 name: 'Galliprant 20mg',
//                 date: '08/10/2024',
//                 description: 'Galliprant is a non-steroidal anti-inflammatory drug (NSAID) specifically formulated for dogs with osteoarthritis. It helps reduce pain and inflammation without the side effects typically associated with other NSAIDs, making it a good choice for long-term management of arthritis in aging pets.',
//                 doctor: 'Dr. Michael Green',
//             },
//         ],
//         Appointments: [
//             {
//                 name: 'Annual Wellness Exam',
//                 date: '07/10/2024',
//                 description: 'The annual wellness exam is a comprehensive check-up to evaluate the overall health of the pet. During this exam, the vet checks for any signs of illness, updates vaccinations, and discusses preventive care such as dental cleanings, parasite control, and weight management.',
//                 doctor: 'Dr. John Doe',
//             },
//             {
//                 name: 'Dental Cleaning',
//                 date: '08/15/2024',
//                 description: 'Routine dental cleaning is performed under anesthesia to remove plaque and tartar buildup, which can lead to periodontal disease if left untreated. Dental health is essential for pets to prevent pain, tooth loss, and systemic health issues caused by bacterial infections.',
//                 doctor: 'Dr. Sarah Smith',
//             },
//             {
//                 name: 'Surgery Consultation',
//                 date: '07/25/2024',
//                 description: 'This consultation was to discuss the removal of a benign growth. The vet explained the surgical process, post-operative care, and expected recovery time. Pre-surgical blood work and other diagnostics were recommended to ensure the pet’s safety during the procedure.',
//                 doctor: 'Dr. Emily Brown',
//             },
//             {
//                 name: 'Spay/Neuter Surgery',
//                 date: '06/30/2024',
//                 description: 'The spay/neuter surgery is a routine procedure performed to sterilize pets. It helps reduce the risk of certain cancers and eliminates the chance of unwanted litters. This surgery typically involves an overnight stay for observation and pain management post-surgery.',
//                 doctor: 'Dr. Michael Green',
//             },
//         ],
//     };

//     return (
//         <Box sx={{ flexGrow: 1, padding: 2 }}>
//             <Box
//                 sx={{
//                     padding: '10px',
//                     marginBottom: '0px',
//                     boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
//                     borderRadius: '6px'
//                 }}
//             >
//                 <Typography
//                     variant="h4"
//                     align="left"
//                     sx={{
//                         marginBottom: 2,
//                         fontWeight: 'bold'
//                     }}
//                 >
//                     Medical Records
//                 </Typography>
//             </Box>

//             <Grid container spacing={3} sx={{ marginTop: 0 }}>
//                 {['Immunization', 'Appointments', 'Medication'].map((type) => (
//                     <Grid item xs={4} key={type}>
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 width: '100%',
//                                 height: 'auto',
//                                 margin: '0 auto',
//                                 position: 'relative',
//                                 padding: 2,
//                                 boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
//                                 boxSizing: 'border-box',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 justifyContent: 'space-between',
//                             }}
//                         >
//                             <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
//                                 {type}
//                             </Typography>
//                             <Box>
//                                 {medicalRecords[type]?.map((record, index) => (
//                                     <Box
//                                         key={index}
//                                         sx={{
//                                             marginBottom: 2,
//                                             display: 'flex',
//                                             justifyContent: 'space-between',
//                                             alignItems: 'center'
//                                         }}
//                                     >
//                                         <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
//                                             {record.name}
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ color: 'gray', marginRight: 2 }}>
//                                             {record.date}
//                                         </Typography>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             sx={{ display: 'flex', alignItems: 'center' }}
//                                             onClick={() => handleClickOpen(record)}
//                                         >
//                                             <BookIcon sx={{ marginRight: 1 }} />
//                                             <Typography sx={{ color: 'white' }}>
//                                                 View More
//                                             </Typography>
//                                         </Button>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </Paper>
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* Dialog for Medical Record Details */}
//             <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//                 <DialogTitle>{selectedRecord.name}</DialogTitle>
//                 <DialogContent>
//                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
//                         Date: {selectedRecord.date}
//                     </Typography>
//                     <Typography variant="body2" sx={{ marginBottom: 1 }}>
//                         {selectedRecord.description}
//                     </Typography>
//                     <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
//                         Doctor: {selectedRecord.doctor}
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default MedicalRecords;
