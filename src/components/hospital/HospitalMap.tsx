
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Hospital } from '@/services/hospitalService';

interface HospitalMapProps {
  hospital: Hospital;
}

const HospitalMap = ({ hospital }: HospitalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = React.useState<string>('');

  useEffect(() => {
    // Allow users to input a Mapbox token if needed
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapToken || !hospital.latitude || !hospital.longitude) return;

    // Initialize map
    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [hospital.longitude, hospital.latitude],
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add marker for hospital location
    new mapboxgl.Marker()
      .setLngLat([hospital.longitude, hospital.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${hospital.hospital_name}</h3><p>${hospital.address}</p>`)
      )
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [hospital, mapToken]);

  if (!mapToken) {
    return (
      <div className="rounded-md overflow-hidden bg-black/20 flex flex-col items-center justify-center p-4">
        <p className="mb-2">Please enter your Mapbox access token:</p>
        <input 
          type="text" 
          className="p-2 rounded bg-background border border-border w-full mb-2"
          placeholder="Enter Mapbox token" 
          onChange={(e) => {
            localStorage.setItem('mapbox_token', e.target.value);
            setMapToken(e.target.value);
          }}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Get your token from <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
        </p>
      </div>
    );
  }

  if (!hospital.latitude || !hospital.longitude) {
    return (
      <div className="rounded-md overflow-hidden bg-black/20 flex items-center justify-center h-48">
        <p>No location data available for this hospital</p>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden aspect-video bg-black/20 w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default HospitalMap;
