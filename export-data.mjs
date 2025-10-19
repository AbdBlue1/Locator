import { pretLocations } from './server/pret-locations-data.ts';
import { sainsburysLocations } from './server/sainsburys-locations-data.ts';
import { tflStations } from './server/tfl-stations-data.ts';
import { nationalRailStations } from './server/national-rail-stations-data.ts';
import fs from 'fs';

// Combine all locations
const allLocations = [
  ...pretLocations,
  ...sainsburysLocations,
  ...tflStations,
  ...nationalRailStations
];

// Write to public folder
fs.mkdirSync('client/public/data', { recursive: true });
fs.writeFileSync('client/public/data/locations.json', JSON.stringify(allLocations, null, 2));

console.log('✅ Created locations.json');
console.log('📍 Total locations:', allLocations.length);
console.log('  - Pret:', pretLocations.length);
console.log('  - Sainsburys:', sainsburysLocations.length);
console.log('  - TfL:', tflStations.length);
console.log('  - National Rail:', nationalRailStations.length);

const fileSizeMB = (fs.statSync('client/public/data/locations.json').size / 1024 / 1024).toFixed(2);
console.log('📦 File size:', fileSizeMB, 'MB');
