import * as fs from 'fs';

interface UKRailStation {
  stationName: string;
  crsCode: string;
  lat: number;
  long: number;
  constituentCountry: string;
}

// Greater London bounding box (slightly larger than TfL coverage)
const LONDON_BOUNDS = {
  minLat: 51.2,
  maxLat: 51.8,
  minLon: -0.6,
  maxLon: 0.4
};

const rawData: UKRailStation[] = JSON.parse(
  fs.readFileSync('/tmp/uk-rail-stations.json', 'utf8')
);

console.log(`Total UK stations: ${rawData.length}`);

// Filter for Greater London and valid coordinates
const londonStations = rawData.filter(station => {
  if (!station.lat || !station.long) return false;
  
  return station.lat >= LONDON_BOUNDS.minLat && 
         station.lat <= LONDON_BOUNDS.maxLat &&
         station.long >= LONDON_BOUNDS.minLon && 
         station.long <= LONDON_BOUNDS.maxLon;
});

console.log(`London stations found: ${londonStations.length}`);

// Sample some stations for verification
console.log('\nSample stations:');
londonStations.slice(0, 5).forEach(s => {
  console.log(`  ${s.stationName} (${s.crsCode}): ${s.lat}, ${s.long}`);
});

// Transform to our format
const formattedStations = londonStations.map(station => ({
  id: `rail-${station.crsCode}`,
  name: `${station.stationName} Rail Station`,
  brand: 'national-rail',
  latitude: station.lat,
  longitude: station.long,
  crsCode: station.crsCode,
}));

// Write TypeScript file
const tsContent = `// Greater London National Rail Stations
// Source: github.com/davwheat/uk-railway-stations
// Generated: ${new Date().toISOString()}
// Total stations: ${formattedStations.length}

export interface NationalRailStation {
  id: string;
  name: string;
  brand: 'national-rail';
  latitude: number;
  longitude: number;
  crsCode: string;
}

export const nationalRailStations: NationalRailStation[] = ${JSON.stringify(formattedStations, null, 2)};
`;

fs.writeFileSync('server/national-rail-stations-data.ts', tsContent);
console.log('\nSaved to server/national-rail-stations-data.ts');
