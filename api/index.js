// Vercel serverless function for API routes
const express = require('express');
const app = express();

// Import your location data
const { pretLocations } = require('../server/pret-locations-data.ts');
const { sainsburysLocations } = require('../server/sainsburys-locations-data.ts');
const { tflStations } = require('../server/tfl-stations-data.ts');
const { nationalRailStations } = require('../server/national-rail-stations-data.ts');

app.use(express.json());

// API endpoint to get all locations
app.get('/api/locations', async (req, res) => {
  try {
    const allLocations = [...pretLocations, ...sainsburysLocations, ...tflStations, ...nationalRailStations];
    res.json({ success: true, locations: allLocations });
  } catch (error) {
    console.error("Error in /api/locations:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch locations",
      locations: []
    });
  }
});

// Export for Vercel serverless
module.exports = app;
