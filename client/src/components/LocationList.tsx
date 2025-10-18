import { ScrollArea } from "@/components/ui/scroll-area";
import LocationCard from "./LocationCard";
import type { Location } from "@shared/schema";

interface LocationListProps {
  locations: Location[];
  selectedLocationId?: string;
  onLocationSelect: (location: Location) => void;
}

export default function LocationList({ locations, selectedLocationId, onLocationSelect }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">No locations found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 p-4" data-testid="list-locations">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onClick={() => onLocationSelect(location)}
            isSelected={selectedLocationId === location.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
