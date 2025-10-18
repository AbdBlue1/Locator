import fs from 'fs/promises';
import type { Location } from '@shared/schema';

function formatOpeningTimes(times: any[]): string {
  if (!times || times.length === 0) return '';
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const schedule: { [key: string]: string } = {};
  
  times.forEach(t => {
    const dayName = days[t.day];
    if (t.start_time && t.end_time) {
      schedule[dayName] = `${t.start_time}-${t.end_time}`;
    }
  });
  
  // Group consecutive days with same hours
  const grouped: string[] = [];
  let currentGroup: string[] = [];
  let currentHours = '';
  
  // Reorder to start from Monday
  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  orderedDays.forEach(day => {
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

async function transformSainsburys() {
  const rawData = JSON.parse(await fs.readFile('/tmp/sainsburys-london.json', 'utf-8'));
  
  const transformedLocations: Location[] = rawData
    .filter((store: any) => store.location && store.location.lat && store.location.lon)
    .map((store: any) => {
      const isLocal = store.store_type === 'local';
      return {
        id: `sainsburys-${store.code}`,
        name: isLocal ? `${store.name} Local` : store.name,
        address: [store.contact.address1, store.contact.address2].filter(Boolean).join(', '),
        city: store.contact.city || 'London',
        postcode: store.contact.post_code,
        latitude: parseFloat(store.location.lat),
        longitude: parseFloat(store.location.lon),
        status: 'open' as const,
        openingHours: formatOpeningTimes(store.opening_times),
        phone: store.contact.telephone || undefined,
        brand: 'sainsburys' as const
      };
    });
  
  await fs.writeFile(
    'server/sainsburys-london-locations.json',
    JSON.stringify(transformedLocations, null, 2)
  );
  
  console.log(`✅ Transformed ${transformedLocations.length} Sainsbury's London locations`);
  
  const localStores = transformedLocations.filter(l => l.name.toLowerCase().includes('local'));
  console.log(`🏪 Sainsbury's Local stores: ${localStores.length}`);
  console.log(`🏬 Regular Sainsbury's stores: ${transformedLocations.length - localStores.length}`);
  
  // Show a sample
  console.log('\n=== Sample Sainsbury\'s Store ===');
  const sample = transformedLocations.find(l => l.openingHours && l.phone);
  if (sample) {
    console.log(JSON.stringify(sample, null, 2));
  }
}

transformSainsburys().catch(console.error);
