import { useEffect, useRef } from "react";
import type { Location } from "@shared/schema";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
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
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (!window.google) {
        const script = document.createElement('script');
        // Note: For production, you'd need a real API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
          initializeMap();
        };
        
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Initialize map centered on UK
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 54.5, lng: -3.5 },
          zoom: 6,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
      }

      updateMarkers();
    };

    const updateMarkers = () => {
      if (!window.google || !mapInstanceRef.current) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Create custom icon for Pret locations
      const icon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#8B1538', // Pret burgundy
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10,
      };

      // Add markers for all locations
      locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: mapInstanceRef.current,
          title: location.name,
          icon: icon,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px; font-family: Inter, sans-serif;">
              <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 8px 0; color: #1a1a1a;">${location.name}</h3>
              <p style="font-size: 12px; color: #666; margin: 4px 0;">${location.address}</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0;">${location.city}, ${location.postcode}</p>
              ${location.openingHours ? `<p style="font-size: 12px; color: #666; margin: 8px 0 0 0;">⏰ ${location.openingHours}</p>` : ''}
            </div>
          `,
        });

        // Add click listener
        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(mapInstanceRef.current, marker);
          onLocationSelect(location);
        });

        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      });
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [locations, onLocationSelect]);

  // Pan to selected location and open info window
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current && window.google) {
      mapInstanceRef.current.setCenter({ 
        lat: selectedLocation.latitude, 
        lng: selectedLocation.longitude 
      });
      mapInstanceRef.current.setZoom(15);
      
      // Open the info window for the selected marker
      const marker = markersRef.current.find(m => {
        const pos = m.getPosition();
        return pos.lat() === selectedLocation.latitude && pos.lng() === selectedLocation.longitude;
      });
      
      if (marker && marker.infoWindow) {
        // Close all other info windows first
        markersRef.current.forEach(m => {
          if (m.infoWindow && m !== marker) {
            m.infoWindow.close();
          }
        });
        marker.infoWindow.open(mapInstanceRef.current, marker);
      }
    }
  }, [selectedLocation]);

  return (
    <div ref={mapRef} className="w-full h-full" data-testid="map-container" />
  );
}
