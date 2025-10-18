import fs from 'fs/promises';
import type { Location } from '@shared/schema';

async function transformScrapedData() {
  const rawData = JSON.parse(await fs.readFile('server/scraped-london-locations.json', 'utf-8'));
  
  const transformedLocations: Location[] = rawData.map((loc: any) => ({
    id: loc.identifier || String(loc.id),
    name: loc.name || 'Pret A Manger',
    address: loc.addressExtra 
      ? `${loc.streetAndNumber}, ${loc.addressExtra}`
      : loc.streetAndNumber,
    city: loc.city,
    postcode: loc.zip,
    latitude: loc.lat,
    longitude: loc.lng,
    status: 'open' as const,
    openingHours: undefined,
    phone: undefined
  }));
  
  await fs.writeFile(
    'server/pret-london-locations.json',
    JSON.stringify(transformedLocations, null, 2)
  );
  
  console.log(`✅ Transformed ${transformedLocations.length} London locations`);
  console.log('📁 Saved to: server/pret-london-locations.json');
}

transformScrapedData().catch(console.error);
