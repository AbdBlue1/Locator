import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import MapFilterBox, { type FilterOptions } from "@/components/MapFilterBox";
import type { Location } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    showPretAll: true,
    showPretLondon: false,
    showSainsburysAll: false,
    showSainsburysLocal: false,
    showTflStations: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  // Fetch all locations from backend
  const { data, isLoading, error } = useQuery<{ success: boolean; locations: Location[] }>({
    queryKey: ["/api/locations"],
  });

  const allLocations = data?.locations || [];

  const filteredLocations = useMemo(() => {
    let filtered: Location[] = [];

    // Add Pret locations based on filters
    if (filters.showPretAll) {
      const pretStores = allLocations.filter(loc => loc.brand === 'pret');
      filtered = [...filtered, ...pretStores];
    }

    if (filters.showPretLondon) {
      const pretLondon = allLocations.filter(loc => 
        loc.brand === 'pret' && loc.city.trim().toLowerCase() === 'london'
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

    // Remove duplicates (in case both "All" and specific filter are checked)
    const uniqueFiltered = Array.from(new Map(filtered.map(loc => [loc.id, loc])).values());
    
    return uniqueFiltered;
  }, [allLocations, filters]);

  // Determine which brand to show based on filters (for map centering)
  const selectedBrand = useMemo(() => {
    const hasPret = filters.showPretAll || filters.showPretLondon;
    const hasSainsburys = filters.showSainsburysAll || filters.showSainsburysLocal;
    const hasTfl = filters.showTflStations;
    
    // If TfL or Sainsbury's is selected, zoom to London (both are London-based)
    if (hasTfl || hasSainsburys) {
      return 'sainsburys' as const;
    }
    
    return 'pret' as const;
  }, [filters]);

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
          filters={filters}
          onFilterChange={setFilters}
          locationCount={filteredLocations.length}
        />
      </div>
    </div>
  );
}
