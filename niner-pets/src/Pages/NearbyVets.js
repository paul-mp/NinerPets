import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider, Button } from '@mui/material';
import { green } from '@mui/material/colors';

const UNCC_GREEN = "046A38";

const NearbyVets = () => {
  const mapRef = useRef(null); // Reference to the map container
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Get API key from environment variables
  const [vets, setVets] = useState([]); // State to store the list of nearby vets
  const infoWindowRef = useRef(null); // To keep track of the info window

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('googleMaps');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        window.initMap = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const charlotteCoords = { lat: 35.2271, lng: -80.8431 };
        //setting initial map center to charlotte coordinates
        const map = new window.google.maps.Map(mapRef.current, {
          center: charlotteCoords,
          //initial zoom level, maybe change to 10 but it shows quite a bit
          zoom: 11,
        });

        const service = new window.google.maps.places.PlacesService(map);
        const infoWindow = new window.google.maps.InfoWindow();
        infoWindowRef.current = infoWindow;

        service.nearbySearch(
          {
            location: charlotteCoords,
            //20km radius
            radius: 20000,
            //only looking for veterinarian offices
            type: 'veterinary_care',
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setVets(results);
              results.forEach((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });

                // Add a click event to show the info window with the vet's name
                marker.addListener('click', () => {
                  infoWindow.setContent(`<strong>${place.name}</strong><br/>${place.vicinity}`);
                  infoWindow.open(map, marker);
                });
              });
            }
          }
        );
      }
    };

    loadGoogleMapsScript();
  }, [apiKey]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, color: UNCC_GREEN }}>
        Nearby Veterinarian Offices
      </Typography>
      <Box ref={mapRef} sx={{ height: '400px', width: '100%', mb: 3, borderRadius: 2, overflow: 'hidden' }} />
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" align="center" sx={{ color: UNCC_GREEN, mb: 1 }}>
          Veterinarians in the Charlotte Area (20Km)
        </Typography>
        <List>
          {vets.length > 0 ? (
            vets.map((vet) => (
              <React.Fragment key={vet.place_id}>
                <ListItem>
                  <ListItemText primary={vet.name} secondary={vet.vicinity} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      window.open(`https://www.google.com/maps/place/?q=place_id:${vet.place_id}`, '_blank')
                    }
                    sx={{ ml: 2, backgroundColor: UNCC_GREEN }}
                  >
                    Open in Google Maps
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography align="center" sx={{ color: UNCC_GREEN }}>
              Loading nearby veterinarians...
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NearbyVets;
