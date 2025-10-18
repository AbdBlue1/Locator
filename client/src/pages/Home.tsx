import { useState, useMemo } from "react";
import MapView from "@/components/MapView";
import MapFilterBox from "@/components/MapFilterBox";
import { mockLocations } from "@/lib/mockData";
import type { Location } from "@shared/schema";

export default function Home() {
  const [showLondonOnly, setShowLondonOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  const filteredLocations = useMemo(() => {
    if (showLondonOnly) {
      return mockLocations.filter(loc => loc.city.toLowerCase() === 'london');
    }
    return mockLocations;
  }, [showLondonOnly]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map takes full screen */}
      <MapView
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
      />
      
      {/* Filter box in top-right corner */}
      <div className="absolute top-4 right-4 z-[1000]">
        <MapFilterBox
          showLondonOnly={showLondonOnly}
          onToggle={setShowLondonOnly}
          locationCount={filteredLocations.length}
        />
      </div>
    </div>
  );
}
