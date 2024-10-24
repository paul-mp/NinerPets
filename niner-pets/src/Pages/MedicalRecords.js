import { Box, Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import React, { useState } from 'react';

const MedicalRecords = () => {
    const [open, setOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});

    const handleClickOpen = (record) => {
        setSelectedRecord(record);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRecord({});
    };

    // Sample pet medical record details with longer descriptions and doctor info
    const medicalRecords = {
        Immunization: [
            {
                name: 'Rabies Vaccine',
                date: '08/10/2024',
                description: 'The Rabies vaccine is a crucial vaccine to prevent rabies, a highly dangerous and often fatal viral disease that can be transmitted to humans through bites. Pets are required by law to be vaccinated in most states. Booster shots are typically required annually or every three years, depending on the vaccine.',
                doctor: 'Dr. John Doe',
            },
            {
                name: 'Distemper Vaccine',
                date: '07/05/2024',
                description: 'The Distemper vaccine protects against a contagious and serious viral illness that affects multiple systems in dogs. The vaccine is typically given in combination with other core vaccines. It is administered as part of a series of vaccines in young puppies and continues with booster shots throughout the dog’s life.',
                doctor: 'Dr. Sarah Smith',
            },
            {
                name: 'Bordetella Vaccine',
                date: '06/20/2024',
                description: 'This vaccine protects against Bordetella bronchiseptica, a bacterium that causes kennel cough. The vaccine is recommended for dogs who are frequently boarded, visit dog parks, or are exposed to other dogs often. It helps prevent the highly contagious respiratory illness, especially in social environments.',
                doctor: 'Dr. Emily Brown',
            },
            {
                name: 'Leptospirosis Vaccine',
                date: '06/01/2024',
                description: 'Leptospirosis is a bacterial infection spread through the urine of infected animals, especially in areas with standing water. The vaccine protects pets from this potentially deadly infection, which can also affect humans. It is an important consideration for pets that spend time outdoors or in rural areas.',
                doctor: 'Dr. Michael Green',
            },
        ],
        Medication: [
            {
                name: 'Heartgard Plus',
                date: '09/15/2024',
                description: 'Heartgard Plus is a monthly oral medication that prevents heartworm infection in dogs. It also protects against roundworms and hookworms, which can cause gastrointestinal issues. This medication should be administered year-round, even in winter months, to maintain full protection.',
                doctor: 'Dr. John Doe',
            },
            {
                name: 'Bravecto Chewable',
                date: '09/01/2024',
                description: 'Bravecto is a chewable tablet given to dogs to prevent flea infestations and kill ticks for up to 12 weeks. It works quickly and provides long-lasting protection, making it convenient for pet owners who prefer fewer doses. It’s especially recommended in areas with a high risk of tick-borne diseases.',
                doctor: 'Dr. Sarah Smith',
            },
            {
                name: 'Apoquel 16mg',
                date: '08/20/2024',
                description: 'Apoquel is used to control itching and inflammation caused by allergic skin conditions in dogs. It provides rapid relief and can be used long-term under veterinary supervision. This medication is often used for dogs with chronic atopic dermatitis, environmental allergies, or food sensitivities.',
                doctor: 'Dr. Emily Brown',
            },
            {
                name: 'Galliprant 20mg',
                date: '08/10/2024',
                description: 'Galliprant is a non-steroidal anti-inflammatory drug (NSAID) specifically formulated for dogs with osteoarthritis. It helps reduce pain and inflammation without the side effects typically associated with other NSAIDs, making it a good choice for long-term management of arthritis in aging pets.',
                doctor: 'Dr. Michael Green',
            },
        ],
        Appointments: [
            {
                name: 'Annual Wellness Exam',
                date: '07/10/2024',
                description: 'The annual wellness exam is a comprehensive check-up to evaluate the overall health of the pet. During this exam, the vet checks for any signs of illness, updates vaccinations, and discusses preventive care such as dental cleanings, parasite control, and weight management.',
                doctor: 'Dr. John Doe',
            },
            {
                name: 'Dental Cleaning',
                date: '08/15/2024',
                description: 'Routine dental cleaning is performed under anesthesia to remove plaque and tartar buildup, which can lead to periodontal disease if left untreated. Dental health is essential for pets to prevent pain, tooth loss, and systemic health issues caused by bacterial infections.',
                doctor: 'Dr. Sarah Smith',
            },
            {
                name: 'Surgery Consultation',
                date: '07/25/2024',
                description: 'This consultation was to discuss the removal of a benign growth. The vet explained the surgical process, post-operative care, and expected recovery time. Pre-surgical blood work and other diagnostics were recommended to ensure the pet’s safety during the procedure.',
                doctor: 'Dr. Emily Brown',
            },
            {
                name: 'Spay/Neuter Surgery',
                date: '06/30/2024',
                description: 'The spay/neuter surgery is a routine procedure performed to sterilize pets. It helps reduce the risk of certain cancers and eliminates the chance of unwanted litters. This surgery typically involves an overnight stay for observation and pain management post-surgery.',
                doctor: 'Dr. Michael Green',
            },
        ],
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
                    Medical Records
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ marginTop: 0 }}>
                {['Immunization', 'Appointments', 'Medication'].map((type) => (
                    <Grid item xs={4} key={type}>
                        <Paper
                            elevation={3}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                margin: '0 auto',
                                position: 'relative',
                                padding: 2,
                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                {type}
                            </Typography>
                            <Box>
                                {medicalRecords[type]?.map((record, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginBottom: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                                            {record.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'gray', marginRight: 2 }}>
                                            {record.date}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ display: 'flex', alignItems: 'center' }}
                                            onClick={() => handleClickOpen(record)}
                                        >
                                            <BookIcon sx={{ marginRight: 1 }} />
                                            <Typography sx={{ color: 'white' }}>
                                                View More
                                            </Typography>
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Medical Record Details */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{selectedRecord.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Date: {selectedRecord.date}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {selectedRecord.description}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
                        Doctor: {selectedRecord.doctor}
                    </Typography>
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

export default MedicalRecords;
