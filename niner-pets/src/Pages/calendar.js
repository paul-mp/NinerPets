import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  // These should be defined in your .env file as REACT_APP_CALENDAR_API and REACT_APP_CALENDAR_ID
  const API_KEY = process.env.REACT_APP_CALENDAR_API;
  const CLIENT_ID = process.env.REACT_APP_CALENDAR_ID;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
    // Function to load Google scripts
    const loadGoogleScripts = () => {
      const script1 = document.createElement('script');
      script1.src = 'https://apis.google.com/js/api.js';
      script1.onload = gapiLoaded;
      script1.onerror = () => console.error('Failed to load Google API script');
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.src = 'https://accounts.google.com/gsi/client';
      script2.onload = gisLoaded;
      script2.onerror = () => console.error('Failed to load Google Identity Services script');
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
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    };

    const gisLoaded = () => {
      if (window.google) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // Will set this in handleAuthClick
        });
        setTokenClient(client);
        setGisInited(true);
      } else {
        console.error('Google Identity Services script failed to load');
      }
    };

    loadGoogleScripts();
  }, [API_KEY, CLIENT_ID]);

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
      await listUpcomingEvents();
    };

    tokenClient.requestAccessToken();
  };

  const listUpcomingEvents = async () => {
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
      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-background">
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                <strong>Calendar Events</strong>
              </Typography>
              <Button variant="contained" onClick={handleAuthClick}>
                Authorize and Fetch Events
              </Button>
              <Box sx={{ marginTop: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  events.length > 0 ? (
                    events.map(event => (
                      <Paper key={event.id} elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                        <Typography variant="subtitle1">
                          <strong>{event.summary}</strong> - {event.start.dateTime || event.start.date}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography>No upcoming events found.</Typography>
                  )
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default CalendarPage;
