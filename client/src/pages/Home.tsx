import { useState, useMemo } from "react";
import MapView from "@/components/MapView";
import MapFilterBox, { type FilterOptions } from "@/components/MapFilterBox";
import type { Location } from "@shared/schema";
import { allLocations } from "@/data/all-locations";

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    showPretAll: true,
    showPretLondon: false,
    showSainsburysAll: false,
    showSainsburysLocal: false,
    showTflStations: false,
    showNationalRail: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

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
