import { Button } from "@/components/ui/button";

export type FilterType = 'all' | 'open' | 'closed' | 'closing_soon';

interface FilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open Now', value: 'open' },
    { label: 'Closing Soon', value: 'closing_soon' },
    { label: 'Closed', value: 'closed' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="rounded-full"
          data-testid={`button-filter-${filter.value}`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
