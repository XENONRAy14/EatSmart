import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issues in React
const fixLeafletIcon = () => {
  delete (Icon.Default.prototype as any)._getIconUrl;
  
  Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon,
    shadowUrl: markerShadow,
  });
};

const Map = () => {
  const position: [number, number] = [43.2946, 5.3933]; // Coordonnées de Marseille (Lycée Marie Curie)
  
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          Lycée Marie Curie <br />
          16 Bd Jeanne d'Arc, 13005 Marseille
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;