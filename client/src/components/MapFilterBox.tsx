import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MapFilterBoxProps {
  selectedBrand: 'pret' | 'sainsburys';
  onBrandChange: (brand: 'pret' | 'sainsburys') => void;
  showLondonOnly: boolean;
  onLondonToggle: (checked: boolean) => void;
  showLocalOnly: boolean;
  onLocalToggle: (checked: boolean) => void;
  locationCount: number;
}

export default function MapFilterBox({ 
  selectedBrand,
  onBrandChange,
  showLondonOnly, 
  onLondonToggle,
  showLocalOnly,
  onLocalToggle,
  locationCount 
}: MapFilterBoxProps) {
  return (
    <Card className="p-4 shadow-lg bg-background/95 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Brand Selection */}
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-2">Select Brand</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedBrand === 'pret' ? 'default' : 'outline'}
              onClick={() => onBrandChange('pret')}
              className="flex-1"
              data-testid="button-select-pret"
            >
              Pret
            </Button>
            <Button
              size="sm"
              variant={selectedBrand === 'sainsburys' ? 'default' : 'outline'}
              onClick={() => onBrandChange('sainsburys')}
              className="flex-1"
              data-testid="button-select-sainsburys"
            >
              Sainsbury's
            </Button>
          </div>
        </div>

        {/* Location Count */}
        <div>
          <p className="text-xs text-muted-foreground" data-testid="text-location-count">
            Showing {locationCount} location{locationCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Pret Filters */}
        {selectedBrand === 'pret' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="london-only"
              checked={showLondonOnly}
              onCheckedChange={onLondonToggle}
              data-testid="checkbox-london-only"
            />
            <Label
              htmlFor="london-only"
              className="text-sm font-normal cursor-pointer"
            >
              Show London only
            </Label>
          </div>
        )}

        {/* Sainsbury's Filters */}
        {selectedBrand === 'sainsburys' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="local-only"
              checked={showLocalOnly}
              onCheckedChange={onLocalToggle}
              data-testid="checkbox-local-only"
            />
            <Label
              htmlFor="local-only"
              className="text-sm font-normal cursor-pointer"
            >
              Show Local stores only
            </Label>
          </div>
        )}
      </div>
    </Card>
  );
}
