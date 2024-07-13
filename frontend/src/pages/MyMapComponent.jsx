import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, TrafficLayer } from '@react-google-maps/api';
import io from 'socket.io-client';

const socket = io('https://kukunya.onrender.com'); // Replace with your Socket.IO server URL

const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 6.5868, lng: 3.9949 }); // Default location
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [emergencyMarker, setEmergencyMarker] = useState(null);

  const dangerLocations = [
    { id: 1, name: 'Location 2', coordinates: { lat: 6.5887, lng: 3.9720 } },
    { id: 2, name: 'Location 3', coordinates: { lat: 6.5897, lng: 3.9730 } },
    { id: 3, name: 'Location 4', coordinates: { lat: 3.5907, lng: 3.9740 } },
    { id: 4, name: 'Location 5', coordinates: { lat: 7.5917, lng: 3.9750 } }
  ];

  useEffect(() => {
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('emergency', (data) => {
      console.log('Received emergency data:', data);
      setSelectedEmergency(data);
      setEmergencyMarker(data.coordinates);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggle = () => {
    setSelectedMarker({ name: 'You are here', ...currentLocation });
    setShowTraffic(!showTraffic);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
  };

  const handleEmergencyClick = (emergency) => {
    setSelectedEmergency(emergency);
  };

  const handleResponseClick = (emergency) => {
    // Add your response logic here
    console.log(`Responding to ${emergency.name}`);
  };

  const handleShowInMapClick = (location) => {
    setEmergencyMarker({ name: location.name, ...location.coordinates });
  };

  const calculateDistance = (location1, location2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((location2.lat - location1.lat) * Math.PI) / 180;
    const dLng = ((location2.lng - location1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location1.lat * Math.PI) / 180) *
      Math.cos((location2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAIZAHqq0Gpw0yNcq6LgsQd9EAGpee5sMg">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>Kukunya</div>
          <div style={styles.headerRight}>
            <div style={styles.organizationName}>Organization Name</div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>
        <div style={styles.content}>
          <div style={styles.mapContainer}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={currentLocation}
              zoom={13}
            >
              {showTraffic && <TrafficLayer />}
              <Marker
                position={currentLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }}
                onClick={() => setSelectedMarker({ name: 'You are here', ...currentLocation })}
              />
              {selectedMarker && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  }}
                  onClick={() => setSelectedMarker({ name: "Current Location", ...currentLocation })}
                />
              )}
              {emergencyMarker && (
                <Marker
                  position={emergencyMarker}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                  onClick={() => setSelectedMarker({ name: emergencyMarker.name, ...emergencyMarker })}
                />
              )}
              {selectedMarker && selectedMarker.name !== 'You are here' && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h2>{selectedMarker.name}</h2>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
            <button onClick={handleToggle} style={styles.toggleButton}>
              Show My Location
            </button>
          </div>
          <div style={styles.sidebar}>
            <h2>Emergencies</h2>
            {dangerLocations.map((location) => (
              <div
                key={location.id}
                style={styles.emergencyItem}
                onClick={() => handleEmergencyClick(location)}
              >
                <div style={styles.emergencyHeader}>
                  <span>{location.name}</span>
                  <span>{calculateDistance(currentLocation, location.coordinates)} km away</span>
                </div>
                {selectedEmergency && selectedEmergency.id === location.id && (
                  <div style={styles.emergencyDetails}>
                    <p>Latitude: {location.coordinates.lat}</p>
                    <p>Longitude: {location.coordinates.lng}</p>
                    <button
                      style={styles.showInMapButton}
                      onClick={() => handleShowInMapClick(location)}
                    >
                      Show in Map
                    </button>
                    <button
                      style={styles.responseButton}
                      onClick={() => handleResponseClick(location)}
                    >
                      We're coming!
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#333',
    color: '#fff',
    zIndex: 10,
  },
  headerLeft: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  organizationName: {
    marginRight: '20px',
    fontSize: '16px',
  },
  logoutButton: {
    padding: '10px 20px',
    background: '#fff',
    color: '#333',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  mapContainer: {
    flex: 2,
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '10px 20px',
    background: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    zIndex: 10,
  },
  sidebar: {
    width: '300px',
    background: '#f0f0f0',
    padding: '10px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  emergencyItem: {
    padding: '10px',
    margin: '10px 0',
    background: '#fff',
    cursor: 'pointer',
    border: '1px solid #ccc',
  },
  emergencyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  emergencyDetails: {
    marginTop: '10px',
  },
  showInMapButton: {
    display: 'block',
    marginBottom: '10px',
    padding: '5px 10px',
    background: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  responseButton: {
    display: 'block',
    padding: '5px 10px',
    background: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  '@media (max-width: 768px)': {
    header: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    headerRight: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    toggleButton: {
      margin: '10px 0',
    },
    sidebar: {
      width: '100%',
      height: '200px',
      overflowY: 'scroll',
    },
  },
};

export default MyMapComponent;
