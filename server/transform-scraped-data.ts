import fs from 'fs/promises';
import type { Location } from '@shared/schema';

async function transformScrapedData() {
  const rawData = JSON.parse(await fs.readFile('server/scraped-all-uk-locations.json', 'utf-8'));
  
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
  
  // Count by city
  const cityCounts: Record<string, number> = {};
  transformedLocations.forEach(loc => {
    cityCounts[loc.city] = (cityCounts[loc.city] || 0) + 1;
  });
  
  await fs.writeFile(
    'server/pret-all-uk-locations.json',
    JSON.stringify(transformedLocations, null, 2)
  );
  
  console.log(`✅ Transformed ${transformedLocations.length} UK locations`);
  console.log('📁 Saved to: server/pret-all-uk-locations.json');
  console.log('\nLocations by city:');
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => console.log(`  ${city}: ${count}`));
}

transformScrapedData().catch(console.error);
