import { MapPin, Clock, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function LocationCard({ location, onClick, isSelected }: LocationCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closing_soon':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-chart-3 text-white';
      case 'closing_soon':
        return 'bg-chart-4 text-foreground';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };

  return (
    <Card
      className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${
        isSelected ? 'border-primary border-2' : ''
      }`}
      onClick={onClick}
      data-testid={`card-location-${location.id}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base text-foreground" data-testid={`text-location-name-${location.id}`}>
            {location.name}
          </h3>
          <Badge 
            className={`${getStatusColor(location.status)} rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap`}
            data-testid={`badge-status-${location.id}`}
          >
            {location.status === 'open' ? 'Open' : location.status === 'closing_soon' ? 'Closing Soon' : 'Closed'}
          </Badge>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p data-testid={`text-address-${location.id}`}>{location.address}</p>
            <p data-testid={`text-city-${location.id}`}>{location.city}, {location.postcode}</p>
          </div>
        </div>

        {location.openingHours && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span data-testid={`text-hours-${location.id}`}>{location.openingHours}</span>
          </div>
        )}

        {location.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span data-testid={`text-phone-${location.id}`}>{location.phone}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
