import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState([6.5867, 3.9700]); // Default location
  const [zoom, setZoom] = useState(13);

  const dangerLocations = [
    { name: 'Location 2', coordinates: [6.5887, 3.9720] },
    { name: 'Location 3', coordinates: [6.5897, 3.9730] },
    { name: 'Location 4', coordinates: [6.5907, 3.9740] },
    { name: 'Location 5', coordinates: [7.5917, 3.9750] }
  ];

  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const customMarkerIcon2 = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7906/7906677.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

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

  return (
    <MapContainer center={currentLocation} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={currentLocation} icon={customMarkerIcon}>
        <Popup>
          You are here.
        </Popup>
      </Marker>

      {dangerLocations.map((location, index) => {
        const distance = calculateDistance(
          currentLocation[0],
          currentLocation[1],
          location.coordinates[0],
          location.coordinates[1]
        ).toFixed(2);
        return (
          <Marker key={index} position={location.coordinates} icon={customMarkerIcon2}>
            <Popup>{`${location.name} - ${distance} km away`}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MyMapComponent;
