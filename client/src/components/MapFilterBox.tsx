import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MapFilterBoxProps {
  showLondonOnly: boolean;
  onToggle: (checked: boolean) => void;
  locationCount: number;
}

export default function MapFilterBox({ showLondonOnly, onToggle, locationCount }: MapFilterBoxProps) {
  return (
    <Card className="p-4 shadow-lg bg-background/95 backdrop-blur-sm">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-1">
            Pret A Manger UK
          </h3>
          <p className="text-xs text-muted-foreground" data-testid="text-location-count">
            Showing {locationCount} location{locationCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="london-only"
            checked={showLondonOnly}
            onCheckedChange={onToggle}
            data-testid="checkbox-london-only"
          />
          <Label
            htmlFor="london-only"
            className="text-sm font-normal cursor-pointer"
          >
            Show London only
          </Label>
        </div>
      </div>
    </Card>
  );
}
