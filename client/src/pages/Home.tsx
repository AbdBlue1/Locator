import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import MapFilterBox from "@/components/MapFilterBox";
import type { Location } from "@shared/schema";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState<'pret' | 'sainsburys'>('pret');
  const [showLondonOnly, setShowLondonOnly] = useState(false);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  // Fetch all locations from backend
  const { data, isLoading, error } = useQuery<{ success: boolean; locations: Location[] }>({
    queryKey: ["/api/locations"],
  });

  const allLocations = data?.locations || [];

  const filteredLocations = useMemo(() => {
    let filtered = allLocations;

    // Filter by brand
    filtered = filtered.filter(loc => loc.brand === selectedBrand);

    // Apply brand-specific filters
    if (selectedBrand === 'pret' && showLondonOnly) {
      filtered = filtered.filter(loc => 
        loc.city.trim().toLowerCase() === 'london'
      );
    }

    if (selectedBrand === 'sainsburys' && showLocalOnly) {
      filtered = filtered.filter(loc => 
        loc.name.toLowerCase().includes('local')
      );
    }

    return filtered;
  }, [allLocations, selectedBrand, showLondonOnly, showLocalOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" data-testid="loading-spinner"></div>
          <p className="text-muted-foreground">Loading locations...</p>
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
        selectedBrand={selectedBrand}
      />
      
      {/* Filter box in top-right corner */}
      <div className="absolute top-4 right-4 z-[1000]">
        <MapFilterBox
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          showLondonOnly={showLondonOnly}
          onLondonToggle={setShowLondonOnly}
          showLocalOnly={showLocalOnly}
          onLocalToggle={setShowLocalOnly}
          locationCount={filteredLocations.length}
        />
      </div>
    </div>
  );
}
