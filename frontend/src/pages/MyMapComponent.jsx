import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, TrafficLayer } from '@react-google-maps/api';
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import getData from "../helpers/getData";
import {base_url} from "../utils/constants"

const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 6.5868, lng: 3.9949 }); // Default location
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [selectedEmergencyId, setSelectedEmergencyId] = useState(null);
  const [emergencyMarker, setEmergencyMarker] = useState(null);
  const [dangerLocations, setDangerLocations] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('/auth/organizations/current');
        if (response.status === 401) {
          console.log(response.status);
          setOrganization(401);
          return;
        }
        setOrganization(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://kukunya.onrender.com/issues/all'); // Adjust the endpoint as per your backend API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        // Filter issues within 0-5km range from currentLocation
        const filteredIssues = data.filter(issue => {
          const distance = calculateDistance(currentLocation, issue.location);
          return distance >= 0 && distance <= 5;
        });
        setDangerLocations(filteredIssues); // Set filtered emergency issues in state
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch emergency issues');
      } finally {
        setLoading(false); // Set loading state to false when done
      }
    };

    fetchData();
  }, [currentLocation]);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('https://kukunya.onrender.com');

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('locationUpdate', (data) => {
      console.log('Received location update:', data);
      // Update dangerLocations only if distance is within 0-5km
      const distance = calculateDistance(currentLocation, data.coordinates);
      console.log(organization.organization.type, data.type);
      if (distance >= 0 && distance <= 5 && organization.organization.type === data.type) {
        setDangerLocations((prevLocations) => [...prevLocations, { ...data, distance, condition: "unattendedTo", date: new Date() }]);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentLocation, organization]);

  const handleToggle = () => {
    setSelectedMarker({ name: 'You are here', ...currentLocation });
    setShowTraffic(!showTraffic);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleEmergencyClick = (emergency) => {
    setSelectedEmergencyId(emergency._id === selectedEmergencyId ? null : emergency._id);
  };

  const handleResponseClick = (emergency) => {
    console.log(emergency)
    if (socketRef.current) {
      socketRef.current.emit("respondToEmergency", { emergencyId: emergency.user });
    }
  };

  const handleShowInMapClick = (location) => {
    const { latitude, longitude } = location.location || {};
    console.log("latitude:", location.location)
    if (latitude && longitude) {
      setEmergencyMarker({ name: location.name, ...{ lat: latitude, lng: longitude } });
    }
  };

  const calculateDistance = (location1, location2) => {
    if (!location2 || !location2.latitude || !location2.longitude) return 0;
    const R = 6371; // Radius of the Earth in km
    const dLat = ((location2.latitude - location1.lat) * Math.PI) / 180;
    const dLng = ((location2.longitude - location1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location1.lat * Math.PI) / 180) *
      Math.cos((location2.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  if (!organization) {
    return <p>Loading...</p>;
  } else if (organization === 401) {
    { console.log(23) }
    return <p>Unauthorized, <Link to="/login">please login</Link> </p>;
  } else return (
    <LoadScript googleMapsApiKey="AIzaSyAIZAHqq0Gpw0yNcq6LgsQd9EAGpee5sMg">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>Kukunya</div>
          <div style={styles.headerRight}>
            <div style={styles.organizationName}>{organization?.organization?.name}</div>
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
            {dangerLocations.map((location, index) => (
              <div
                key={index}
                style={styles.emergencyItem}
                onClick={() => handleEmergencyClick(location)}
              >
                <div style={styles.emergencyHeader}>
                  <span style = {{fontWeight: "bold" }}>{ location.e_type }</span>
                  <span>{calculateDistance(currentLocation, location.location)} km away</span>
                  <span>Time: {new Date(location.time).toLocaleString() !== "Invalid Date" ? new Date(location.time).toLocaleString() : "Just Now"}</span>
                  <span>Condition: {location.condition}</span>
                </div>
                {selectedEmergencyId === location._id && (
                  <div style={styles.emergencyDetails}>
                    <p>Latitude: {location?.location?.latitude}</p>
                    <p>Longitude: {location?.location?.longitude}</p>
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
    overflow: "hidden"
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
    height: "90vh",
    marginBottom: "20px"
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
    flexDirection: "column"
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
