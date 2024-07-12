import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, TrafficLayer } from '@react-google-maps/api';
// 
const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 6.5868, lng: 3.9949 }); // Default location
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);

  const dangerLocations = [
    { name: 'Location 2', coordinates: { lat: 6.5887, lng: 3.9720 } },
    { name: 'Location 3', coordinates: { lat: 6.5897, lng: 3.9730 } },
    { name: 'Location 4', coordinates: { lat: 3.5907, lng: 3.9740 } },
    { name: 'Location 5', coordinates: { lat: 7.5917, lng: 3.9750 } }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleToggle = () => {
    setShowTraffic((prev) => !prev);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAIZAHqq0Gpw0yNcq6LgsQd9EAGpee5sMg">
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <button
          onClick={handleToggle}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            padding: '10px 20px',
            background: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          
          Show My Location
        </button>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={currentLocation}
          zoom={13}
        >
          {showTraffic && <TrafficLayer />}
          {showTraffic && (
            <>
              <Marker
                position={currentLocation}
                onClick={() => setSelectedMarker({ name: 'You are here', ...currentLocation })}
              />
              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h2>{selectedMarker.name}</h2>
                  </div>
                </InfoWindow>
              )}
              {/* {dangerLocations.map((location, index) => {
                const distance = calculateDistance(
                  currentLocation.lat,
                  currentLocation.lng,
                  location.coordinates.lat,
                  location.coordinates.lng
                ).toFixed(2);
                return (
                  <Marker
                    key={index}
                    position={location.coordinates}
                    onClick={() => setSelectedMarker({ name: `${location.name} - ${distance} km away`, ...location.coordinates })}
                  />
                );
              })} */}
            </>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MyMapComponent;
