import { useState } from 'react';
import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="w-96">
      <SearchBar
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value);
          console.log('Search value:', value);
        }}
        placeholder="Search Pret locations..."
      />
    </div>
  );
}
