// Import all location data for Vercel deployment
import { pretLocations } from '../../../server/pret-locations-data';
import { sainsburysLocations } from '../../../server/sainsburys-locations-data';
import { tflStations } from '../../../server/tfl-stations-data';
import { nationalRailStations } from '../../../server/national-rail-stations-data';

export const allLocations = [
  ...pretLocations,
  ...sainsburysLocations,
  ...tflStations,
  ...nationalRailStations
];
