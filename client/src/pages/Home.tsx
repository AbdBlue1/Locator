import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import MapFilterBox from "@/components/MapFilterBox";
import type { Location } from "@shared/schema";

export default function Home() {
  const [showLondonOnly, setShowLondonOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  // Fetch real Pret locations from backend
  const { data, isLoading, error } = useQuery<{ success: boolean; locations: Location[] }>({
    queryKey: ["/api/locations"],
  });

  const allLocations = data?.locations || [];

  const filteredLocations = useMemo(() => {
    if (showLondonOnly) {
      // Filter to show ONLY London locations (exactly 275)
      return allLocations.filter(loc => 
        loc.city.trim().toLowerCase() === 'london'
      );
    }
    return allLocations;
  }, [allLocations, showLondonOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" data-testid="loading-spinner"></div>
          <p className="text-muted-foreground">Loading Pret locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4 p-8">
          <p className="text-destructive font-semibold">Error loading locations</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map takes full screen */}
      <MapView
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
        showLondonOnly={showLondonOnly}
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
