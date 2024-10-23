import {Box,Button,CircularProgress,Dialog,DialogActions,DialogContent,DialogTitle,Paper,TextField,Typography,} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Event details
  const [eventDetails, setEventDetails] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventId: '', // Add eventId to track which event to remove
  });

  // Popup state
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false); // State for remove dialog
  const [selectedEventId, setSelectedEventId] = useState(''); // Store selected event ID for removal

  // API and Client IDs
  const API_KEY = process.env.REACT_APP_CALENDAR_API;
  const CLIENT_ID = process.env.REACT_APP_CALENDAR_ID;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  useEffect(() => {
    loadGoogleScripts();

    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      reinitializeGapiClient(accessToken);
    }
  }, []);

  const loadGoogleScripts = () => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.onload = gisLoaded;
    document.body.appendChild(script2);
  };

  const gapiLoaded = () => {
    window.gapi.load('client', initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
      checkIfSignedIn();
    } catch (error) {
      console.error('Error initializing GAPI client:', error);
    }
  };

  const reinitializeGapiClient = async (accessToken) => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
      window.gapi.auth.setToken({
        access_token: accessToken,
      });
      setIsSignedIn(true);
      await listUpcomingEvents();
    } catch (error) {
      console.error('Error reinitializing GAPI client:', error);
    }
  };

  const gisLoaded = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });
    setTokenClient(client);
    setGisInited(true);
  };

  const checkIfSignedIn = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsSignedIn(true);
      listUpcomingEvents();
    }
  };

  const handleAuthClick = () => {
    if (!gapiInited || !gisInited || !tokenClient) {
      return;
    }

    tokenClient.callback = async (response) => {
      if (response.error) {
        console.error('Auth error:', response.error);
        return;
      }

      localStorage.setItem('access_token', response.access_token);
      setIsSignedIn(true);
      await listUpcomingEvents();
    };

    tokenClient.requestAccessToken();
  };

  const listUpcomingEvents = async () => {
    if (!gapiInited) {
      return;
    }

    setLoading(true);

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch events: ' + response.statusText);
      }

      const fetchedEvents = response.result.items.map(event => ({
        id: event.id, // Store event ID
        title: event.summary || 'No Title',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error in listUpcomingEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    setIsSignedIn(false);
    setEvents([]);
  };

  // Add event function
  const addEvent = async () => {
    if (!gapiInited || !isSignedIn) {
      console.error('GAPI not initialized or user not signed in');
      return;
    }

    const { title, startDate, startTime, endDate, endTime } = eventDetails;

    // Combine date and time into ISO format
    const start = new Date(`${startDate}T${convertTo24Hour(startTime)}`);
    const end = new Date(`${endDate}T${convertTo24Hour(endTime)}`);

    // Validate date and time
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Invalid start or end date/time');
      return;
    }

    const event = {
      summary: title,
      start: {
        dateTime: start.toISOString(),
      },
      end: {
        dateTime: end.toISOString(),
      },
    };

    try {
      await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      // Reset event details after adding
      setEventDetails({ title: '', startDate: '', startTime: '', endDate: '', endTime: '' });
      setOpen(false); // Close the modal
      await listUpcomingEvents(); // Refresh events list after adding
      console.log('Event added successfully.');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Convert time to 24-hour format for Date object
  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '0';
    }

    return `${hours}:${minutes}`;
  };

  // Open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Open the remove dialog
  const openRemoveDialog = () => {
    setRemoveOpen(true);
  };

  // Close the remove modal
  const handleRemoveClose = () => {
    setRemoveOpen(false);
  };

  // Remove event function
  const removeEvent = async () => {
    if (!gapiInited || !isSignedIn) {
      console.error('GAPI not initialized or user not signed in');
      return;
    }

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: selectedEventId,
      });

      console.log('Event removed successfully.');
      await listUpcomingEvents(); // Refresh events list after removal
      setRemoveOpen(false); // Close the remove dialog
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h5">Google Calendar Events</Typography>
        {!isSignedIn ? (
          <Button variant="contained" onClick={handleAuthClick}>
            Sign in to Google
          </Button>
        ) : (
          <Box display="flex" alignItems="center">
            <Button variant="contained" onClick={handleSignOut} sx={{ marginRight: 2 }}>
              Sign Out
            </Button>
            <Button variant="contained" onClick={handleOpen} sx={{ marginRight: 2 }}>
              Add Event
            </Button>
            <Button variant="contained" onClick={openRemoveDialog}>
              Remove Event
            </Button>
          </Box>
        )}
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          events={events}
          // Scale down the calendar by applying a CSS transform
          style={{ width: '400px', height: '250px' }}        
        />
      )}

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={eventDetails.title}
            onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start Date (YYYY-MM-DD)"
            fullWidth
            variant="outlined"
            value={eventDetails.startDate}
            onChange={(e) => setEventDetails({ ...eventDetails, startDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start Time (e.g., 8:00 AM)"
            fullWidth
            variant="outlined"
            value={eventDetails.startTime}
            onChange={(e) => setEventDetails({ ...eventDetails, startTime: e.target.value })}
          />
          <TextField
            margin="dense"
            label="End Date (YYYY-MM-DD)"
            fullWidth
            variant="outlined"
            value={eventDetails.endDate}
            onChange={(e) => setEventDetails({ ...eventDetails, endDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="End Time (e.g., 9:00 AM)"
            fullWidth
            variant="outlined"
            value={eventDetails.endTime}
            onChange={(e) => setEventDetails({ ...eventDetails, endTime: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addEvent}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Event Dialog */}
      <Dialog open={removeOpen} onClose={handleRemoveClose}>
        <DialogTitle>Remove Event</DialogTitle>
        <DialogContent>
          <Typography>Select an event to remove:</Typography>
          {events.map(event => (
            <Box key={event.id}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSelectedEventId(event.id); 
                  removeEvent(); // Call remove event directly
                }}
                sx={{ margin: 1 }}
              >
                {event.title}
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CalendarPage;
