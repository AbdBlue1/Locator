import { useState } from 'react';
import FilterChips, { type FilterType } from '../FilterChips';

export default function FilterChipsExample() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  return (
    <FilterChips
      activeFilter={activeFilter}
      onFilterChange={(filter) => {
        setActiveFilter(filter);
        console.log('Filter changed to:', filter);
      }}
    />
  );
}
