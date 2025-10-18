import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import FilterChips, { type FilterType } from "./FilterChips";
import LocationList from "./LocationList";
import type { Location } from "@shared/schema";

interface SidebarProps {
  locations: Location[];
  selectedLocation?: Location;
  onLocationSelect: (location: Location) => void;
}

export default function Sidebar({ locations, selectedLocation, onLocationSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.postcode.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesFilter = activeFilter === 'all' || location.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [locations, searchQuery, activeFilter]);

  return (
    <div className="w-full md:w-96 border-r bg-background flex flex-col h-full">
      <div className="p-4 space-y-4 border-b flex-shrink-0">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search locations..."
        />
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="text-sm text-muted-foreground" data-testid="text-results-count">
          Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <LocationList
          locations={filteredLocations}
          selectedLocationId={selectedLocation?.id}
          onLocationSelect={onLocationSelect}
        />
      </div>
    </div>
  );
}
