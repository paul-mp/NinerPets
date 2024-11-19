import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialogTitle = styled(DialogTitle)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DetailText = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  color: '#333',
  margin: '8px 0',
});

const DetailTitle = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  color: '#000',
  fontSize: '1.2rem',
  marginBottom: '8px',
});

const DateText = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  color: '#000',
  marginBottom: '8px',
});

const CustomButton = styled(Button)({
  backgroundColor: '#005035',
  color: 'white',
  fontFamily: 'Roboto, sans-serif',
  '&:hover': {
    backgroundColor: '#003922',
  },
});

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('authToken'); // Get token from localStorage
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
              throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserId(data.id); 
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        fetchUserData();
        const response = await fetch(`http://localhost:5000/appointments?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const appointments = await response.json();

        const mappedEvents = appointments.map((appointment) => ({
          id: appointment.id.toString(),
          title: appointment.reason || 'No reason provided',
          start: `${appointment.date}T${appointment.time || '00:00'}`,
          location: appointment.location || 'No location provided',
          time: appointment.time,
          date: appointment.date,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        setError('Error fetching appointment data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find((event) => event.id === clickInfo.event.id);
    setSelectedEvent(clickedEvent);
    setOpenDetailDialog(true);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ marginTop: '20px' }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            editable={true}
            selectable={true}
            contentHeight={750}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            views={{
              dayGridMonth: { dayMaxEventRows: 2 },
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
          />
        </Box>
      )}

      {/* Enhanced Event Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} fullWidth maxWidth="sm">
        <StyledDialogTitle>
          Event Details
          <IconButton edge="end" color="inherit" onClick={() => setOpenDetailDialog(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent dividers>
          {selectedEvent ? (
            <Box sx={{ paddingTop: '16px' }}>
              <DetailTitle>{selectedEvent.title}</DetailTitle>
              <DateText>Date: {selectedEvent.date}</DateText>
              <DetailText>Time: {selectedEvent.time || 'All day'}</DetailText>
              <DetailText>Location: {selectedEvent.location || 'No location provided'}</DetailText>
            </Box>
          ) : (
            <Typography>No event details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenDetailDialog(false)}>Close</CustomButton>
        </DialogActions>
      </Dialog>

      {/* Inline CSS for toolbar title and button alignment */}
      <style jsx>{`
        .fc .fc-toolbar-title {
          font-family: Roboto, sans-serif;
          font-size: 1.5rem;
          color: #000;
        }
        .fc-toolbar.fc-header-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1%;
        }
        .fc-toolbar-chunk {
          display: flex;
          gap: 8px; /* Adds spacing between buttons */
        }
        .fc-toolbar .fc-toolbar-chunk:first-child {
          justify-content: flex-start;
        }
        .fc-toolbar .fc-toolbar-chunk:last-child {
          justify-content: flex-end;
        }
        .fc-button {
          background-color: #005035 !important;
          color: white !important;
          font-family: Roboto, sans-serif !important;
          border: none !important;
          margin: 0 4px; /* Add horizontal space between buttons */
        }
        .fc-button:hover {
          background-color: #003922 !important;
        }
        .fc-event, .fc-daygrid-event, .fc-daygrid-block-event {
          background-color: #005035 !important; /* Change event background to green */
          border-color: #003922 !important; /* Border color for better contrast */
          color: white !important; /* Event text color */
          padding-left: 5px;
        }
        .fc-daygrid-event-dot {
          display: none !important; /* Remove the dot completely */
        }
        .custom-event-content {
          padding-left: 8px; /* Adds space to the left of the event */
        }
      `}</style>
    </div>
  );
}

export default Calendar;
