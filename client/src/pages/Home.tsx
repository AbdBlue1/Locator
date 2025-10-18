import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import { mockLocations } from "@/lib/mockData";
import type { Location } from "@shared/schema";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          locations={mockLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
        <div className="flex-1 relative">
          <MapView
            locations={mockLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
}
