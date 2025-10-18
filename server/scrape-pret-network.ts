import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import type { Location } from '@shared/schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeAllLondonLocations(): Promise<Location[]> {
  console.log('Starting Puppeteer scraper with network interception...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Store all API responses
    const apiResponses: any[] = [];
    
    // Enable request interception
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      // Log all requests to see what's being called
      const url = request.url();
      if (url.includes('uberall') || url.includes('location') || url.includes('shop') || url.includes('store')) {
        console.log('Request:', url);
      }
      request.continue();
    });
    
    page.on('response', async (response) => {
      const url = response.url();
      
      // Capture responses from Uberall API or any location/shop endpoints
      if (url.includes('uberall') || url.includes('/locations') || url.includes('/shops') || url.includes('/stores')) {
        console.log('Response from:', url, '| Status:', response.status());
        
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            const json = await response.json();
            console.log(`Captured JSON response (${Object.keys(json).length} keys)`);
            apiResponses.push({
              url,
              data: json
            });
          }
        } catch (e) {
          // Not JSON or couldn't parse
        }
      }
    });
    
    console.log('Navigating to London shop finder...');
    await page.goto('https://www.pret.co.uk/en-GB/shop-finder/l/london', {
      waitUntil: 'networkidle0',
      timeout: 90000
    });
    
    console.log('Page loaded, waiting for API calls...');
    await delay(15000); // Wait for all API calls to complete
    
    console.log(`Captured ${apiResponses.length} API responses`);
    
    // Save all API responses for inspection
    if (apiResponses.length > 0) {
      await fs.writeFile(
        'server/api-responses-debug.json',
        JSON.stringify(apiResponses, null, 2)
      );
      console.log('Saved API responses to server/api-responses-debug.json');
    }
    
    // Try to find location data in the responses
    let allLocations: any[] = [];
    
    for (const response of apiResponses) {
      const data = response.data;
      
      // Check various possible structures
      if (data.locations && Array.isArray(data.locations)) {
        console.log(`Found ${data.locations.length} locations in response.data.locations`);
        allLocations = allLocations.concat(data.locations);
      } else if (data.response && Array.isArray(data.response)) {
        console.log(`Found ${data.response.length} locations in response.data.response`);
        allLocations = allLocations.concat(data.response);
      } else if (data.data && Array.isArray(data.data)) {
        console.log(`Found ${data.data.length} locations in response.data.data`);
        allLocations = allLocations.concat(data.data);
      } else if (Array.isArray(data)) {
        console.log(`Found ${data.length} locations in response.data (array)`);
        allLocations = allLocations.concat(data);
      }
    }
    
    await browser.close();
    
    if (allLocations.length === 0) {
      console.log('WARNING: No locations were found in API responses.');
      console.log('Check server/api-responses-debug.json for raw API data');
      return [];
    }
    
    // Normalize the location data
    return normalizeLocations(allLocations);
    
  } catch (error) {
    console.error('Error scraping Pret locations:', error);
    await browser.close();
    throw error;
  }
}

function normalizeLocations(rawLocations: any[]): Location[] {
  return rawLocations
    .map((loc: any, index: number) => {
      // Handle different possible data structures
      const lat = parseFloat(loc.lat || loc.latitude || loc.location?.lat || loc.geo?.lat || 0);
      const lng = parseFloat(loc.lng || loc.lon || loc.longitude || loc.location?.lng || loc.geo?.lng || 0);
      
      // Skip invalid locations
      if (lat === 0 || lng === 0) {
        return null;
      }
      
      // Only include London locations (approximate bounds)
      // London is roughly between 51.2° to 51.7° N and -0.5° to 0.3° E
      if (lat < 51.2 || lat > 51.7 || lng < -0.5 || lng > 0.3) {
        return null;
      }
      
      return {
        id: loc.id || `london-${index + 1}`,
        name: loc.name || loc.title || loc.shopName || 'Pret A Manger',
        address: loc.streetAndNo || loc.address || loc.street || loc.addressLine1 || '',
        city: loc.city || 'London',
        postcode: loc.zip || loc.postcode || loc.postalCode || '',
        latitude: lat,
        longitude: lng,
        status: (loc.open || loc.isOpen || !loc.closed) ? 'open' : 'closed',
        openingHours: loc.openingHours || loc.hours || undefined,
        phone: loc.phone || loc.telephone || loc.phoneNumber || undefined
      } as Location;
    })
    .filter((loc): loc is Location => loc !== null);
}

// Run the scraper if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    try {
      const locations = await scrapeAllLondonLocations();
      
      if (locations.length === 0) {
        console.log('No locations found! Check server/api-responses-debug.json for raw API data.');
        process.exit(1);
      }
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'server', 'scraped-london-locations.json');
      await fs.writeFile(
        outputPath,
        JSON.stringify(locations, null, 2)
      );
      
      console.log(`✅ Successfully scraped ${locations.length} London locations!`);
      console.log(`📁 Saved to: ${outputPath}`);
      
      // Print sample
      console.log('\nSample location:');
      console.log(JSON.stringify(locations[0], null, 2));
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      process.exit(1);
    }
  })();
}
