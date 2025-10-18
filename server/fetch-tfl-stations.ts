// Fetch all London train and tube stations from TfL API
const modes = ['tube', 'overground', 'dlr', 'elizabeth-line'];

interface TfLStation {
  id: string;
  commonName: string;
  lat: number;
  lon: number;
  modes: string[];
  stationNaptan?: string;
}

async function fetchStations(mode: string): Promise<TfLStation[]> {
  const url = `https://api.tfl.gov.uk/StopPoint/mode/${mode}`;
  console.log(`Fetching ${mode} stations...`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${mode}: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`  Found ${data.stopPoints?.length || data.length} stop points for ${mode}`);
  return data.stopPoints || data;
}

async function main() {
  const allStations: TfLStation[] = [];
  
  for (const mode of modes) {
    try {
      const stations = await fetchStations(mode);
      allStations.push(...stations);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    } catch (error) {
      console.error(`Error fetching ${mode}:`, error);
    }
  }
  
  // Group by stationNaptan to avoid duplicate platforms
  const uniqueStations = new Map<string, TfLStation>();
  
  for (const station of allStations) {
    const key = station.stationNaptan || station.id;
    if (!uniqueStations.has(key)) {
      uniqueStations.set(key, station);
    } else {
      // Merge modes if station already exists
      const existing = uniqueStations.get(key)!;
      existing.modes = [...new Set([...existing.modes, ...station.modes])];
    }
  }
  
  console.log(`\nTotal unique stations: ${uniqueStations.size}`);
  
  // Convert to our format
  const formattedStations = Array.from(uniqueStations.values()).map(station => ({
    id: station.stationNaptan || station.id,
    name: station.commonName,
    latitude: station.lat,
    longitude: station.lon,
    modes: station.modes,
  }));
  
  // Write to file
  const fs = await import('fs');
  fs.writeFileSync(
    'server/tfl-stations-raw.json',
    JSON.stringify(formattedStations, null, 2)
  );
  
  console.log('\nSaved to server/tfl-stations-raw.json');
  console.log(`Total stations: ${formattedStations.length}`);
}

main();
