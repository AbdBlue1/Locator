import fs from 'fs/promises';
import type { Location } from '@shared/schema';

// Helper to format opening hours
function formatOpeningHours(hours: any[]): string {
  if (!hours || hours.length === 0) return '';
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const schedule: { [key: string]: string } = {};
  
  hours.forEach(h => {
    const dayName = days[h.dayOfWeek - 1];
    if (h.from1 && h.to1) {
      schedule[dayName] = `${h.from1}-${h.to1}`;
    }
  });
  
  // Group consecutive days with same hours
  const grouped: string[] = [];
  let currentGroup: string[] = [];
  let currentHours = '';
  
  days.forEach(day => {
    const hours = schedule[day] || 'Closed';
    
    if (hours === currentHours) {
      currentGroup.push(day);
    } else {
      if (currentGroup.length > 0) {
        const groupStr = currentGroup.length > 1 
          ? `${currentGroup[0]}-${currentGroup[currentGroup.length - 1]}`
          : currentGroup[0];
        grouped.push(`${groupStr}: ${currentHours}`);
      }
      currentGroup = [day];
      currentHours = hours;
    }
  });
  
  // Add last group
  if (currentGroup.length > 0) {
    const groupStr = currentGroup.length > 1 
      ? `${currentGroup[0]}-${currentGroup[currentGroup.length - 1]}`
      : currentGroup[0];
    grouped.push(`${groupStr}: ${currentHours}`);
  }
  
  return grouped.join(', ');
}

async function transformData() {
  const rawData = JSON.parse(await fs.readFile('server/scraped-all-uk-with-hours.json', 'utf-8'));
  const locations = rawData.response.locations;
  
  const transformedLocations: Location[] = locations.map((loc: any) => ({
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
    openingHours: loc.openingHours ? formatOpeningHours(loc.openingHours) : undefined,
    phone: loc.phone || undefined
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
  
  const withHours = transformedLocations.filter(l => l.openingHours);
  const withPhone = transformedLocations.filter(l => l.phone);
  console.log(`⏰ Locations with opening hours: ${withHours.length}`);
  console.log(`📞 Locations with phone: ${withPhone.length}`);
  
  // Show a sample
  console.log('\n=== Sample Location ===');
  const sample = transformedLocations.find(l => l.openingHours && l.phone);
  if (sample) {
    console.log(JSON.stringify(sample, null, 2));
  }
}

transformData().catch(console.error);
