import { useState } from 'react';
import Sidebar from '../Sidebar';

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
    openingHours: "07:30 - 20:00",
    phone: "020 7836 7574"
  },
  {
    id: "2",
    name: "Warren Street",
    address: "14 Warren Street",
    city: "London",
    postcode: "W1T 5LL",
    latitude: 51.5246,
    longitude: -0.1374,
    status: "open" as const,
    openingHours: "07:00 - 16:30"
  },
  {
    id: "3",
    name: "Tottenham Court Road",
    address: "67 Tottenham Court Road",
    city: "London",
    postcode: "W1T 2EY",
    latitude: 51.5188,
    longitude: -0.1313,
    status: "closed" as const,
    openingHours: "Opens at 06:30 Mon"
  },
  {
    id: "4",
    name: "Bristol Park",
    address: "12 Park Street",
    city: "Bristol",
    postcode: "BS1 5HH",
    latitude: 51.4545,
    longitude: -2.6010,
    status: "closing_soon" as const,
    openingHours: "Closes at 19:00"
  }
];

export default function SidebarExample() {
  const [selected, setSelected] = useState<typeof mockLocations[0] | undefined>(mockLocations[0]);

  return (
    <div className="h-[600px] w-96 border rounded-lg overflow-hidden">
      <Sidebar
        locations={mockLocations}
        selectedLocation={selected}
        onLocationSelect={(location) => {
          setSelected(location);
          console.log('Location selected:', location);
        }}
      />
    </div>
  );
}
