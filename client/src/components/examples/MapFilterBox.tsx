import { useState } from 'react';
import MapFilterBox from '../MapFilterBox';

export default function MapFilterBoxExample() {
  const [showLondon, setShowLondon] = useState(false);

  return (
    <div className="p-4">
      <MapFilterBox
        showLondonOnly={showLondon}
        onToggle={(checked) => {
          setShowLondon(checked);
          console.log('London filter toggled:', checked);
        }}
        locationCount={showLondon ? 14 : 20}
      />
    </div>
  );
}
