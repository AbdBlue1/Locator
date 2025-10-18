import { useState } from 'react';
import MapView from '../MapView';

const mockLocations = [
  {
    id: "1",
    name: "Shelton Street",
    address: "37 Shelton Street",
    city: "London",
    postcode: "WC2H 9HN",
    latitude: 51.5144,
    longitude: -0.1225,
    status: "open" as const,
    openingHours: "07:30 - 20:00"
  },
  {
    id: "2",
    name: "Lothian Road",
    address: "116 Lothian Road",
    city: "Edinburgh",
    postcode: "EH3 9BE",
    latitude: 55.9445,
    longitude: -3.2041,
    status: "open" as const,
    openingHours: "08:30 - 16:00"
  }
];

export default function MapViewExample() {
  const [selected, setSelected] = useState<typeof mockLocations[0] | undefined>(mockLocations[0]);

  return (
    <div className="h-96 w-full border rounded-lg overflow-hidden">
      <MapView
        locations={mockLocations}
        selectedLocation={selected}
        onLocationSelect={(location) => {
          setSelected(location);
          console.log('Map marker clicked:', location);
        }}
      />
    </div>
  );
}
