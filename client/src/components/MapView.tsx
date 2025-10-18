import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@shared/schema";

interface MapViewProps {
  locations: Location[];
  selectedLocation?: Location;
  onLocationSelect: (location: Location) => void;
  showLondonOnly?: boolean;
}

export default function MapView({ locations, selectedLocation, onLocationSelect, showLondonOnly }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Get Mapbox token from environment variable
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error("Mapbox token not found. Please set VITE_MAPBOX_TOKEN environment variable.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Create map instance centered on UK
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-3.5, 54.5], // UK center
      zoom: 5.5,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Adjust map view when filter changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (showLondonOnly) {
      // Zoom to London
      mapRef.current.flyTo({
        center: [-0.1276, 51.5074], // London center
        zoom: 10,
        duration: 1500,
      });
    } else {
      // Zoom out to show all UK
      mapRef.current.flyTo({
        center: [-3.5, 54.5], // UK center
        zoom: 5.5,
        duration: 1500,
      });
    }
  }, [showLondonOnly]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for all locations
    locations.forEach(location => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.backgroundColor = '#8B1538'; // Pret burgundy
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 12px; min-width: 250px; max-width: 350px; font-family: Inter, sans-serif;">
          <h3 style="font-weight: 600; font-size: 15px; margin: 0 0 10px 0; color: #8B1538; border-bottom: 2px solid #8B1538; padding-bottom: 6px;">${location.name}</h3>
          <div style="margin-bottom: 8px;">
            <p style="font-size: 13px; color: #333; margin: 3px 0; line-height: 1.4;">📍 ${location.address}</p>
            <p style="font-size: 13px; color: #333; margin: 3px 0;">${location.city}, ${location.postcode}</p>
          </div>
          ${location.openingHours ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #555; margin: 0 0 4px 0; font-weight: 500;">⏰ Opening Hours</p>
              <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.5;">${location.openingHours}</p>
            </div>
          ` : ''}
          ${location.phone ? `
            <div style="margin-top: 8px;">
              <p style="font-size: 12px; color: #555; margin: 0;">📞 <a href="tel:${location.phone}" style="color: #8B1538; text-decoration: none;">${location.phone}</a></p>
            </div>
          ` : ''}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      // Add click listener to marker element
      el.addEventListener('click', () => {
        onLocationSelect(location);
      });

      markersRef.current.push(marker);
    });
  }, [locations, onLocationSelect]);

  // Pan to selected location
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
        duration: 1000,
      });

      // Open the popup for the selected marker
      const marker = markersRef.current.find(m => {
        const lngLat = m.getLngLat();
        return lngLat.lat === selectedLocation.latitude && lngLat.lng === selectedLocation.longitude;
      });

      if (marker) {
        marker.togglePopup();
      }
    }
  }, [selectedLocation]);

  return (
    <div ref={mapContainerRef} className="w-full h-full" data-testid="map-container" />
  );
}
