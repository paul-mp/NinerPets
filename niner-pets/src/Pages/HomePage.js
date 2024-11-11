import { Box, Button, CircularProgress, Grid, IconButton, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('User');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true); // Temperature unit toggle state

  const WEATHER_API_KEY = '3fdbd90d38d8c5191acf8e45fd05b0a6';

  const toggleTemperatureUnit = () => setIsCelsius(!isCelsius); // Toggle temperature unit

  // Fetch Vets Data
  useEffect(() => {
    const fetchVets = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/vets');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVets(data);
      } catch (error) {
        console.error('Error fetching vets:', error);
        setVets([]); // Set an empty array if there's an error to avoid undefined data
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch attempt
      }
    };

    fetchVets();
  }, []);

  // Fetch Weather Data
  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        
        setWeather({
          daily: data.daily.slice(0, 5), // Get the next 5 days forecast
          alerts: data.alerts || [],
          currentRainChance: data.daily[0].pop, // Today's chance of rain
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setWeatherLoading(false);
          setLocationError('Location access denied. Unable to retrieve local weather.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setWeatherLoading(false);
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Helper function to get the day name
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString('en-US', { weekday: 'long' }); // Get day of the week
  };

  // Convert temperature based on unit
  const convertTemperature = (temp) => (isCelsius ? temp : (temp * 9) / 5 + 32);

  return (
    <div className="app-background">
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, minHeight: '110px', minWidth: '1100px' }}>
              <Typography variant="h5" gutterBottom>
                <strong>Welcome Back!</strong>
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" component={Link} to="/appointments">Schedule an Appointment</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/medications">Medications</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/billing">Billing Summary</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/manage-pets">Manage Pets</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/medicalrecords">Medical Records</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/faq">FAQ</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" component={Link} to="/NearbyVets">Nearby Vets</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 2, position: 'relative' }}>
              <Typography variant="h6" gutterBottom>
                <strong>Latest Weather Updates</strong>
              </Typography>

              {/* Temperature Toggle Button in Top-Right Corner */}
              <IconButton
                onClick={toggleTemperatureUnit}
                sx={{ position: 'absolute', top: 16, right: 16 }}
                aria-label="Toggle temperature unit"
              >
                <Typography variant="subtitle2">
                  {isCelsius ? '°C' : '°F'}
                </Typography>
              </IconButton>

              <Box sx={{ marginBottom: 2 }}>
                {weatherLoading ? (
                  <CircularProgress />
                ) : (
                  <>
                    {/* Render 5-day forecast */}
                    {weather?.daily.map((day, index) => (
                      <Paper key={index} elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          <strong>{getDayName(day.dt)} Forecast:</strong> {convertTemperature(day.temp.day).toFixed(1)}°{isCelsius ? 'C' : 'F'}, {day.weather[0].description}
                        </Typography>
                        <Typography variant="body2">
                          Max: {convertTemperature(day.temp.max).toFixed(1)}°{isCelsius ? 'C' : 'F'}, Min: {convertTemperature(day.temp.min).toFixed(1)}°{isCelsius ? 'C' : 'F'}
                        </Typography>
                      </Paper>
                    ))}

                    {/* Rain chance for the current day */}
                    <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Today's Rain Chance:</strong> {Math.round(weather.currentRainChance * 100)}%
                      </Typography>
                    </Paper>

                    {/* Weather Alerts */}
                    {weather.alerts.length > 0 ? (
                      weather.alerts.map((alert, index) => (
                        <Paper key={index} elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Alert:</strong> {alert.event}
                          </Typography>
                          <Typography variant="body2">{alert.description}</Typography>
                        </Paper>
                      ))
                    ) : (
                      <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          No weather alerts at the moment.
                        </Typography>
                      </Paper>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Your Care Team and Recent Providers</strong>
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : vets.length > 0 ? (
                  vets.map((vet) => (
                    <Paper key={vet.id} elevation={1} sx={{ padding: 2, marginBottom: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>{vet.name}</strong>
                        <br />
                        {vet.specialty}
                      </Typography>
                      <Button variant="outlined" color="primary" component={Link} to="/vets">
                        Details
                      </Button>
                    </Paper>
                  ))
                ) : (
                  <Typography>No veterinarians available.</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default HomePage;
