import { useState, useMemo, useEffect } from "react";
import MapView from "@/components/MapView";
import MapFilterBox, { type FilterOptions } from "@/components/MapFilterBox";
import type { Location } from "@shared/schema";

export default function Home() {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    showPretAll: true,
    showPretLondon: false,
    showSainsburysAll: false,
    showSainsburysLocal: false,
    showTflStations: false,
    showNationalRail: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  // Fetch locations data from JSON file
  useEffect(() => {
    fetch('/data/locations.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load locations');
        return res.json();
      })
      .then((data: Location[]) => {
        setAllLocations(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredLocations = useMemo(() => {
    let filtered: Location[] = [];

    // Add Pret locations based on filters
    if (filters.showPretAll) {
      const pretStores = allLocations.filter(loc => loc.brand === 'pret');
      filtered = [...filtered, ...pretStores];
    }

    if (filters.showPretLondon) {
      const pretLondon = allLocations.filter(loc => 
        loc.brand === 'pret' && loc.city?.trim().toLowerCase() === 'london'
      );
      // Only add if not already included from showPretAll
      if (!filters.showPretAll) {
        filtered = [...filtered, ...pretLondon];
      }
    }

    // Add Sainsbury's locations based on filters
    if (filters.showSainsburysAll) {
      const sainsburysStores = allLocations.filter(loc => loc.brand === 'sainsburys');
      filtered = [...filtered, ...sainsburysStores];
    }

    if (filters.showSainsburysLocal) {
      const sainsburysLocal = allLocations.filter(loc => 
        loc.brand === 'sainsburys' && loc.name.toLowerCase().includes('local')
      );
      // Only add if not already included from showSainsburysAll
      if (!filters.showSainsburysAll) {
        filtered = [...filtered, ...sainsburysLocal];
      }
    }

    // Add TfL stations based on filters
    if (filters.showTflStations) {
      const tflStations = allLocations.filter(loc => loc.brand === 'tfl');
      filtered = [...filtered, ...tflStations];
    }

    // Add National Rail stations based on filters
    if (filters.showNationalRail) {
      const nationalRailStations = allLocations.filter(loc => loc.brand === 'national-rail');
      filtered = [...filtered, ...nationalRailStations];
    }

    // Remove duplicates (in case both "All" and specific filter are checked)
    const uniqueFiltered = Array.from(new Map(filtered.map(loc => [loc.id, loc])).values());
    
    return uniqueFiltered;
  }, [allLocations, filters]);

  // Determine which brand to show based on filters (for map centering)
  const selectedBrand = useMemo(() => {
    const hasPret = filters.showPretAll || filters.showPretLondon;
    const hasSainsburys = filters.showSainsburysAll || filters.showSainsburysLocal;
    const hasTfl = filters.showTflStations;
    const hasNationalRail = filters.showNationalRail;
    
    // If TfL, National Rail, or Sainsbury's is selected, zoom to London (all are London-based)
    if (hasTfl || hasNationalRail || hasSainsburys) {
      return 'sainsburys' as const;
    }
    
    return 'pret' as const;
  }, [filters]);


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground" data-testid="text-loading">Loading locations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold" data-testid="text-error">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover-elevate"
            data-testid="button-retry"
          >
            Retry
          </button>
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
          filters={filters}
          onFilterChange={setFilters}
          locationCount={filteredLocations.length}
        />
      </div>
    </div>
  );
}
