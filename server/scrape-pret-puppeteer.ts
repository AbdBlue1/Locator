import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import type { Location } from '@shared/schema';

export async function scrapeAllLondonLocations(): Promise<Location[]> {
  console.log('Starting Puppeteer scraper...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to London shop finder...');
    await page.goto('https://www.pret.co.uk/en-GB/shop-finder/l/london', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Waiting for Uberall widget to load...');
    // Wait for the store locator widget to fully load
    await page.waitForSelector('.uberall-locator', { timeout: 30000 }).catch(() => {
      console.log('Uberall selector not found, trying alternative selectors...');
    });
    
    // Wait a bit more for all locations to load
    await page.waitForTimeout(5000);
    
    console.log('Extracting location data from page...');
    
    // Extract all location data from the page
    const locations = await page.evaluate(() => {
      const locationElements: Location[] = [];
      
      // Try multiple selectors to find location data
      const selectors = [
        '.location-item',
        '[data-location]',
        '.store-item',
        '.shop-item',
        '[class*="location"]',
        '[class*="store"]'
      ];
      
      // Also try to access the Uberall widget data directly
      const windowAny = window as any;
      
      // Check if Uberall has stored data in window
      if (windowAny.uberall && windowAny.uberall.locations) {
        return windowAny.uberall.locations.map((loc: any, index: number) => ({
          id: loc.id || `london-${index + 1}`,
          name: loc.name || loc.title || 'Pret A Manger',
          address: loc.streetAndNo || loc.address || loc.street || '',
          city: 'London',
          postcode: loc.zip || loc.postcode || '',
          latitude: parseFloat(loc.lat || loc.latitude || 0),
          longitude: parseFloat(loc.lng || loc.lon || loc.longitude || 0),
          status: loc.open || loc.isOpen ? 'open' : 'closed',
          openingHours: loc.openingHours || loc.hours || undefined,
          phone: loc.phone || loc.telephone || undefined
        }));
      }
      
      // Fallback: try to extract from DOM elements
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((el, index) => {
            const name = el.querySelector('[class*="name"]')?.textContent?.trim() ||
                        el.querySelector('h2, h3, h4')?.textContent?.trim() || '';
            const address = el.querySelector('[class*="address"]')?.textContent?.trim() || '';
            const postcode = el.querySelector('[class*="postcode"], [class*="zip"]')?.textContent?.trim() || '';
            
            const latStr = el.getAttribute('data-lat') || el.getAttribute('data-latitude') || '';
            const lngStr = el.getAttribute('data-lng') || el.getAttribute('data-longitude') || '';
            
            if (name && (latStr || address)) {
              locationElements.push({
                id: `london-${index + 1}`,
                name: name || 'Pret A Manger',
                address: address,
                city: 'London',
                postcode: postcode,
                latitude: parseFloat(latStr) || 0,
                longitude: parseFloat(lngStr) || 0,
                status: 'open',
                openingHours: undefined,
                phone: undefined
              });
            }
          });
          
          if (locationElements.length > 0) break;
        }
      }
      
      return locationElements;
    });
    
    console.log(`Found ${locations.length} locations`);
    
    // If we didn't find locations, try scrolling and waiting more
    if (locations.length === 0) {
      console.log('No locations found, trying to scroll and load more...');
      
      // Scroll down to trigger lazy loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(3000);
      
      // Try extracting again
      const retryLocations = await page.evaluate(() => {
        const windowAny = window as any;
        
        // Check all possible global variables
        const possibleDataSources = [
          windowAny.uberall?.locations,
          windowAny.storeLocations,
          windowAny.locations,
          windowAny.__NEXT_DATA__?.props?.pageProps?.locations,
          windowAny.__NEXT_DATA__?.props?.pageProps?.shops
        ];
        
        for (const source of possibleDataSources) {
          if (source && Array.isArray(source) && source.length > 0) {
            return source.map((loc: any, index: number) => ({
              id: loc.id || `london-${index + 1}`,
              name: loc.name || loc.title || 'Pret A Manger',
              address: loc.streetAndNo || loc.address || loc.street || '',
              city: 'London',
              postcode: loc.zip || loc.postcode || '',
              latitude: parseFloat(loc.lat || loc.latitude || 0),
              longitude: parseFloat(loc.lng || loc.lon || loc.longitude || 0),
              status: 'open',
              openingHours: loc.openingHours || loc.hours || undefined,
              phone: loc.phone || loc.telephone || undefined
            }));
          }
        }
        
        return [];
      });
      
      if (retryLocations.length > 0) {
        console.log(`Found ${retryLocations.length} locations on retry`);
        await browser.close();
        return retryLocations.filter(loc => loc.latitude !== 0 && loc.longitude !== 0);
      }
    }
    
    await browser.close();
    
    // Filter out invalid locations
    const validLocations = locations.filter(loc => loc.latitude !== 0 && loc.longitude !== 0);
    
    console.log(`Extracted ${validLocations.length} valid locations`);
    
    return validLocations;
    
  } catch (error) {
    console.error('Error scraping Pret locations:', error);
    await browser.close();
    throw error;
  }
}

// Run the scraper if called directly
if (require.main === module) {
  (async () => {
    try {
      const locations = await scrapeAllLondonLocations();
      
      // Save to file
      await fs.writeFile(
        'server/scraped-london-locations.json',
        JSON.stringify(locations, null, 2)
      );
      
      console.log(`Successfully scraped ${locations.length} locations!`);
      console.log('Saved to: server/scraped-london-locations.json');
      process.exit(0);
    } catch (error) {
      console.error('Scraping failed:', error);
      process.exit(1);
    }
  })();
}
