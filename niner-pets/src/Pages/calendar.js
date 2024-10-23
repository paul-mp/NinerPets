import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
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

  // API and Client IDs
  const API_KEY = process.env.REACT_APP_CALENDAR_API;
  const CLIENT_ID = process.env.REACT_APP_CALENDAR_ID;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
    loadGoogleScripts();
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
    if (window.gapi) {
      window.gapi.load('client', initializeGapiClient);
    } else {
      console.error('Google API script failed to load');
    }
  };

  const initializeGapiClient = async () => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
      console.log("GAPI client initialized successfully.");

      // Check sign-in status after initialization
      checkIfSignedIn();
    } catch (error) {
      console.error('Error initializing GAPI client:', error);
    }
  };

  const gisLoaded = () => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Set this in handleAuthClick
      });
      setTokenClient(client);
      setGisInited(true);
      console.log("Google Identity Services initialized successfully.");
    } else {
      console.error('Google Identity Services script failed to load');
    }
  };

  const checkIfSignedIn = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsSignedIn(true);
      console.log('User is signed in. Fetching events...');
      listUpcomingEvents(); // Call to fetch events if already signed in
    } else {
      console.log('User not signed in.');
    }
  };

  const handleAuthClick = () => {
    if (!gapiInited || !gisInited || !tokenClient) {
      console.error('Google API is not fully initialized');
      return;
    }

    tokenClient.callback = async (response) => {
      if (response.error) {
        console.error('Auth error:', response.error);
        return;
      }

      localStorage.setItem('access_token', response.access_token);
      setIsSignedIn(true);
      await listUpcomingEvents(); // Fetch events after successful sign-in
    };

    tokenClient.requestAccessToken();
  };

  const listUpcomingEvents = async () => {
    if (!gapiInited) {
      console.error('GAPI not initialized');
      return;
    }

    setLoading(true);
    console.log("Attempting to fetch upcoming events...");

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
        console.error('Error fetching calendar events:', response);
        throw new Error('Failed to fetch events: ' + response.statusText);
      }

      const fetchedEvents = response.result.items.map(event => ({
        title: event.summary || 'No Title',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));

      console.log("Fetched events:", fetchedEvents);
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

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h5">Google Calendar Events</Typography>
        {!isSignedIn ? (
          <Button variant="contained" onClick={handleAuthClick}>
            Sign in with Google
          </Button>
        ) : (
          <>
            <Typography>Signed in successfully.</Typography>
            <Button variant="outlined" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </Paper>

      {loading && <CircularProgress />}

      {!loading && events.length > 0 && (
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          height="auto"
        />
      )}
    </Box>
  );
}

export default CalendarPage;
