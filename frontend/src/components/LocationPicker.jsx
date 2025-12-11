/**
 * LocationPicker Component for AgriConnect
 * Interactive map for selecting delivery location using Leaflet
 */
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Botswana center coordinates (Gaborone area)
const BOTSWANA_CENTER = [-24.6282, 25.9231]; // Gaborone
const DEFAULT_ZOOM = 13;

// Component to handle map click events and marker dragging
const DraggableMarker = ({ position, onPositionChange }) => {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const { lat, lng } = marker.getLatLng();
        onPositionChange({ lat, lng });
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customIcon}
    />
  );
};

// Component to handle map clicks to place marker
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

// Component to recenter map when position changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  
  return null;
};

const LocationPicker = ({ 
  position, 
  onPositionChange, 
  onAddressChange,
  className = '' 
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [mapPosition, setMapPosition] = useState(
    position?.lat && position?.lng 
      ? [position.lat, position.lng] 
      : BOTSWANA_CENTER
  );

  // Update map position when prop changes
  useEffect(() => {
    if (position?.lat && position?.lng) {
      setMapPosition([position.lat, position.lng]);
    }
  }, [position]);

  // Handle position change from marker drag or map click
  const handlePositionChange = ({ lat, lng }) => {
    setMapPosition([lat, lng]);
    onPositionChange({ lat, lng });
    
    // Optional: Reverse geocode to get address
    reverseGeocode(lat, lng);
  };

  // Reverse geocode using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          }
        }
      );
      const data = await response.json();
      
      if (data.display_name && onAddressChange) {
        onAddressChange(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  // Get user's current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handlePositionChange({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please select manually on the map.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
          <MapPin size={16} className="text-primary-500" />
          Select Delivery Location
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLocating ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            <Navigation size={14} />
          )}
          {isLocating ? 'Locating...' : 'Use my location'}
        </button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
        <MapContainer
          center={mapPosition}
          zoom={DEFAULT_ZOOM}
          style={{ height: '250px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handlePositionChange} />
          <RecenterMap position={position?.lat ? { lat: position.lat, lng: position.lng } : null} />
          {position?.lat && position?.lng && (
            <DraggableMarker
              position={[position.lat, position.lng]}
              onPositionChange={handlePositionChange}
            />
          )}
        </MapContainer>
      </div>

      <p className="text-xs text-neutral-500">
        Click on the map or drag the marker to select your delivery location
      </p>

      {position?.lat && position?.lng && (
        <div className="text-xs text-neutral-500 bg-neutral-50 p-2 rounded">
          <span className="font-medium">Coordinates:</span>{' '}
          {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
