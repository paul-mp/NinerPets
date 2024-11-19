import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  FormControl,
  InputLabel,
} from '@mui/material';
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
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', date: '', time: '', location: '', notes: '' });
  const [userId, setUserId] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch('http://localhost:5000/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
      } else {
        console.error('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, []);

  // Fetch appointments for the user
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:5000/appointments?user_id=${userId}`)
      .then((response) => response.json())
      .then((appointments) => {
        const mappedEvents = appointments.map((appointment) => ({
          id: appointment.id.toString(),
          title: appointment.reason || 'No reason provided',
          start: `${appointment.date}T${appointment.time || '00:00'}`,
          location: appointment.location || 'No location provided',
          time: appointment.time,
          date: appointment.date,
          notes: appointment.notes,
        }));
        setEvents(mappedEvents);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching appointment data: ' + error.message);
        setLoading(false);
      });
  }, [userId]);

  // Handle click on event to show details
  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find((event) => event.id === clickInfo.event.id);
    setSelectedEvent(clickedEvent);
    setOpenDetailDialog(true);
  };

  // Handle delete event
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/appointments/${selectedEvent.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setOpenDetailDialog(false);
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting appointment: ' + error.message);
    }
  };

  // Handle save after editing event
  const handleEditSave = async () => {
    try {
      const updatedAppointment = {
        reason: editForm.reason || selectedEvent.reason,
        date: editForm.date || selectedEvent.date,
        time: editForm.time || selectedEvent.time,
        location: editForm.location || selectedEvent.location,
        notes: editForm.notes || selectedEvent.notes,
      };

      const response = await fetch(`http://localhost:5000/appointments/${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAppointment),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error editing appointment:', error);
      alert('Error editing appointment: ' + error.message);
    }
  };

  // Open edit dialog and prepopulate form fields
  const handleOpenEditDialog = () => {
    setEditForm({
      reason: selectedEvent?.reason || '',
      date: selectedEvent?.date || '',
      time: selectedEvent?.time || '',
      location: selectedEvent?.location || '',
      notes: selectedEvent?.notes || '',
    });
    setOpenEditDialog(true);
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
      {/* Event Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} fullWidth maxWidth="sm">
        <StyledDialogTitle>
          Event Details
          <IconButton edge="end" onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <DetailTitle>{selectedEvent.title}</DetailTitle>
              <DateText>Date: {selectedEvent.date}</DateText>
              <DetailText>Time: {selectedEvent.time || 'All day'}</DetailText>
              <DetailText>Location: {selectedEvent.location || 'No location provided'}</DetailText>
              <DetailText>Notes: {selectedEvent.notes || 'No notes provided'}</DetailText>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <CustomButton onClick={handleOpenEditDialog} sx={{ marginRight: 2 }}>Edit</CustomButton>
            <CustomButton onClick={handleDelete}>Delete</CustomButton>
          </Box>
          <CustomButton onClick={() => setOpenDetailDialog(false)}>Close</CustomButton>
        </DialogActions>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
        <StyledDialogTitle>
          Edit Appointment
          <IconButton edge="end" onClick={() => setOpenEditDialog(false)}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent>
          <form>
          <FormControl fullWidth margin="normal">
        <InputLabel>Type of Appointment</InputLabel>
            <Select
              value={editForm.reason || selectedEvent?.reason || ''}
              onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
              label="Type of Appointment"
            >
              <MenuItem value="Routine Checkup">Routine Checkup</MenuItem>
              <MenuItem value="Vaccination">Vaccination</MenuItem>
              <MenuItem value="Surgery Consultation">Surgery Consultation</MenuItem>
              <MenuItem value="Dental Cleaning">Dental Cleaning</MenuItem>
              <MenuItem value="Behavioral Issues">Behavioral Issues</MenuItem>
              <MenuItem value="Skin Problems">Skin Problems</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
            <TextField
              label="Date"
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={editForm.time}
              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          <FormControl fullWidth margin="normal">
            <InputLabel>Location</InputLabel>
            <Select
              value={editForm.location || selectedEvent?.location || ''}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              label="Location"
            >
              <MenuItem value="2734 Diamond Street">2734 Diamond Street</MenuItem>
              <MenuItem value="1825 Dola Mine Road">1825 Dola Mine Road</MenuItem>
              <MenuItem value="402 College Avenue">402 College Avenue</MenuItem>
              <MenuItem value="3888 Beechwood Avenue">3888 Beechwood Avenue</MenuItem>
            </Select>
          </FormControl>
            <TextField
              label="Notes"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleEditSave}>Save Changes</CustomButton>
          <CustomButton onClick={() => setOpenEditDialog(false)}>Cancel</CustomButton>
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
