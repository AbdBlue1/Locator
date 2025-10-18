import { useEffect, useRef } from "react";
import type { Location } from "@shared/schema";

declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  locations: Location[];
  selectedLocation?: Location;
  onLocationSelect: (location: Location) => void;
}

export default function MapView({ locations, selectedLocation, onLocationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const loadLeaflet = () => {
      // Load Leaflet from CDN if not already loaded
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => initializeMap();
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      const L = window.L;

      // Fix default icon paths for Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize map only once
      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current).setView([54.5, -3.5], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      updateMarkers();
    };

    const updateMarkers = () => {
      if (!window.L || !mapInstanceRef.current) return;

      const L = window.L;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Custom icon for Pret locations
      const pretIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 32px; height: 32px; background-color: hsl(var(--primary)); border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Add markers for all locations
      locations.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude], { icon: pretIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: hsl(var(--foreground));">${location.name}</h3>
              <p style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 2px;">${location.address}</p>
              <p style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">${location.city}, ${location.postcode}</p>
              ${location.openingHours ? `<p style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-top: 4px;">⏰ ${location.openingHours}</p>` : ''}
            </div>
          `)
          .on('click', () => {
            onLocationSelect(location);
          });

        markersRef.current.push(marker);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, onLocationSelect]);

  // Pan to selected location
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current && window.L) {
      mapInstanceRef.current.setView([selectedLocation.latitude, selectedLocation.longitude], 15);
      
      // Open popup for selected marker
      markersRef.current.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === selectedLocation.latitude && markerLatLng.lng === selectedLocation.longitude) {
          marker.openPopup();
        }
      });
    }
  }, [selectedLocation]);

  return (
    <div ref={mapRef} className="w-full h-full" data-testid="map-container" />
  );
}
