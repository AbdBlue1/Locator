import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  showPretAll: boolean;
  showPretLondon: boolean;
  showSainsburysAll: boolean;
  showSainsburysLocal: boolean;
  showTflStations: boolean;
}

interface MapFilterBoxProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  locationCount: number;
}

export default function MapFilterBox({ 
  filters,
  onFilterChange,
  locationCount 
}: MapFilterBoxProps) {
  return (
    <Card className="p-4 shadow-lg bg-background/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-1">Filter Locations</h3>
          <p className="text-xs text-muted-foreground" data-testid="text-location-count">
            Showing {locationCount} location{locationCount !== 1 ? 's' : ''}
          </p>
        </div>

        <Separator />

        {/* Pret Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Pret A Manger</h4>
          <div className="space-y-2 ml-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pret-all"
                checked={filters.showPretAll}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, showPretAll: checked as boolean })
                }
                data-testid="checkbox-pret-all"
              />
              <Label htmlFor="pret-all" className="text-sm font-normal cursor-pointer">
                All UK stores (491)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pret-london"
                checked={filters.showPretLondon}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, showPretLondon: checked as boolean })
                }
                data-testid="checkbox-pret-london"
              />
              <Label htmlFor="pret-london" className="text-sm font-normal cursor-pointer">
                London only (275)
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sainsbury's Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Sainsbury's</h4>
          <div className="space-y-2 ml-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sainsburys-all"
                checked={filters.showSainsburysAll}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, showSainsburysAll: checked as boolean })
                }
                data-testid="checkbox-sainsburys-all"
              />
              <Label htmlFor="sainsburys-all" className="text-sm font-normal cursor-pointer">
                All stores (458)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sainsburys-local"
                checked={filters.showSainsburysLocal}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, showSainsburysLocal: checked as boolean })
                }
                data-testid="checkbox-sainsburys-local"
              />
              <Label htmlFor="sainsburys-local" className="text-sm font-normal cursor-pointer">
                Local stores only (267)
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* TfL Stations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">TfL Stations</h4>
          <div className="space-y-2 ml-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tfl-stations"
                checked={filters.showTflStations}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, showTflStations: checked as boolean })
                }
                data-testid="checkbox-tfl-stations"
              />
              <Label htmlFor="tfl-stations" className="text-sm font-normal cursor-pointer">
                All stations (566)
              </Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
