import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';

function Calendar() {
  const [events, setEvents] = useState([]); // Store events
  const [openAddDialog, setOpenAddDialog] = useState(false); // Dialog for adding events
  const [openDetailDialog, setOpenDetailDialog] = useState(false); // Dialog for event details
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', description: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Open dialog to add event
  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setOpenAddDialog(true);
  };

  // Add new event to calendar
  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        id: new Date().toISOString(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
      },
    ]);
    setOpenAddDialog(false);
    setNewEvent({ title: '', date: '', time: '', description: '' });
  };

  // Open dialog with event details
  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find((event) => event.id === clickInfo.event.id);
    setSelectedEvent(clickedEvent);
    setOpenDetailDialog(true);
  };

  // Remove event from calendar
  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setOpenDetailDialog(false);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: event.id,
          title: `${event.title} ${event.time ? `at ${event.time}` : ''}`,
          start: `${event.date}T${event.time ? event.time : '00:00'}`,
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        selectable={true}
        contentHeight={750}     // Fixed height to ensure it fits in the viewport
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        views={{
          dayGridMonth: { dayMaxEventRows: 2 },
        }}
      />

      {/* Add Event Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Event Time"
            type="time"
            fullWidth
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Event Description"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddEvent} color="primary">Add Event</Button>
        </DialogActions>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography>Date: {selectedEvent.date}</Typography>
              <Typography>Time: {selectedEvent.time || 'All day'}</Typography>
              <Typography>Description: {selectedEvent.description || 'No description'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)} color="secondary">Close</Button>
          <Button onClick={handleDeleteEvent} color="error">Delete Event</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calendar;
