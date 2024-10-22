import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
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
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    };

    const gisLoaded = () => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Will set this in handleAuthClick
      });
      setGisInited(true);
      setTokenClient(tokenClient);
    };

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

    loadGoogleScripts();
  }, [CLIENT_ID, API_KEY]);

  const handleAuthClick = async () => {
    if (!gapiInited || !gisInited) return;
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