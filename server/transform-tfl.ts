import * as fs from 'fs';

interface TfLStopPoint {
  stationNaptan?: string;
  naptanId: string;
  commonName: string;
  lat: number;
  lon: number;
  modes: string[];
}

interface TfLResponse {
  stopPoints: TfLStopPoint[];
}

const files = [
  { path: '/tmp/tube-raw.json', mode: 'tube' },
  { path: '/tmp/overground-raw.json', mode: 'overground' },
  { path: '/tmp/dlr-raw.json', mode: 'dlr' },
  { path: '/tmp/elizabeth-raw.json', mode: 'elizabeth-line' },
];

const stationsMap = new Map<string, any>();

for (const file of files) {
  if (!fs.existsSync(file.path)) {
    console.log(`Skipping ${file.mode} - file not found`);
    continue;
  }
  
  const data: TfLResponse = JSON.parse(fs.readFileSync(file.path, 'utf8'));
  console.log(`Processing ${file.mode}: ${data.stopPoints.length} stop points`);
  
  for (const stop of data.stopPoints) {
    // Use stationNaptan as the unique key (groups platforms together)
    const key = stop.stationNaptan || stop.naptanId;
    
    if (!stationsMap.has(key)) {
      stationsMap.set(key, {
        id: `tfl-${key}`,
        name: stop.commonName,
        brand: 'tfl',
        latitude: stop.lat,
        longitude: stop.lon,
        modes: [...stop.modes],
      });
    } else {
      // Merge modes if station already exists
      const existing = stationsMap.get(key);
      existing.modes = [...new Set([...existing.modes, ...stop.modes])];
    }
  }
}

const stations = Array.from(stationsMap.values());
console.log(`\nTotal unique stations: ${stations.length}`);

// Group by mode for statistics
const modeStats = stations.reduce((acc, station) => {
  for (const mode of station.modes) {
    acc[mode] = (acc[mode] || 0) + 1;
  }
  return acc;
}, {} as Record<string, number>);

console.log('\nStations by mode:', modeStats);

// Write TypeScript file
const tsContent = `// London Train and Tube Stations from TfL API
// Generated: ${new Date().toISOString()}
// Total stations: ${stations.length}

export interface TfLStation {
  id: string;
  name: string;
  brand: 'tfl';
  latitude: number;
  longitude: number;
  modes: string[];
}

export const tflStations: TfLStation[] = ${JSON.stringify(stations, null, 2)};
`;

fs.writeFileSync('server/tfl-stations-data.ts', tsContent);
console.log('\nSaved to server/tfl-stations-data.ts');
