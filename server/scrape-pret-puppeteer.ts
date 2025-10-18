import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import type { Location } from '@shared/schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeAllLondonLocations(): Promise<Location[]> {
  console.log('Starting Puppeteer scraper...');
  
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
    
    console.log('Navigating to London shop finder...');
    await page.goto('https://www.pret.co.uk/en-GB/shop-finder/l/london', {
      waitUntil: 'networkidle0',
      timeout: 90000
    });
    
    console.log('Page loaded, waiting for content...');
    await delay(10000); // Wait longer for JavaScript to execute
    
    // Debug: Save HTML to inspect
    const html = await page.content();
    await fs.writeFile('server/page-debug.html', html);
    console.log('Saved page HTML to server/page-debug.html');
    
    // Debug: Check what's available in the window object
    const debugInfo = await page.evaluate(() => {
      const windowAny = window as any;
      return {
        hasUberall: !!windowAny.uberall,
        hasStoreLocations: !!windowAny.storeLocations,
        hasLocations: !!windowAny.locations,
        hasNextData: !!windowAny.__NEXT_DATA__,
        windowKeys: Object.keys(windowAny).filter(k => 
          k.toLowerCase().includes('store') || 
          k.toLowerCase().includes('location') || 
          k.toLowerCase().includes('shop') ||
          k.toLowerCase().includes('uberall')
        ),
        bodyClasses: document.body.className,
        scriptTags: Array.from(document.querySelectorAll('script')).map(s => ({
          src: s.src,
          hasContent: s.innerHTML.length > 0,
          containsLocation: s.innerHTML.toLowerCase().includes('location')
        })).filter(s => s.containsLocation || s.src.includes('uberall'))
      };
    });
    
    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));
    
    // Try to extract locations using various methods
    console.log('Attempting to extract location data...');
    
    const locations = await page.evaluate(() => {
      const windowAny = window as any;
      const results: any[] = [];
      
      // Method 1: Check window.__NEXT_DATA__
      if (windowAny.__NEXT_DATA__?.props?.pageProps) {
        const props = windowAny.__NEXT_DATA__.props.pageProps;
        console.log('Found __NEXT_DATA__, keys:', Object.keys(props));
        
        // Check various possible location keys
        const locationKeys = ['locations', 'shops', 'stores', 'shopData', 'storeData'];
        for (const key of locationKeys) {
          if (props[key] && Array.isArray(props[key])) {
            console.log(`Found ${props[key].length} items in ${key}`);
            return props[key];
          }
        }
      }
      
      // Method 2: Check for Uberall data
      if (windowAny.uberall) {
        console.log('Found uberall object, keys:', Object.keys(windowAny.uberall));
        if (windowAny.uberall.locations) {
          return windowAny.uberall.locations;
        }
        if (windowAny.uberall.stores) {
          return windowAny.uberall.stores;
        }
      }
      
      // Method 3: Check all window properties for arrays with location-like objects
      for (const key of Object.keys(windowAny)) {
        const value = windowAny[key];
        if (Array.isArray(value) && value.length > 10) {
          const firstItem = value[0];
          if (firstItem && typeof firstItem === 'object') {
            // Check if it looks like a location object
            if (firstItem.lat || firstItem.latitude || firstItem.address || firstItem.name) {
              console.log(`Found potential location array in window.${key} with ${value.length} items`);
              return value;
            }
          }
        }
      }
      
      // Method 4: Try to find location list in DOM
      const locationContainers = document.querySelectorAll('[class*="location"], [class*="store"], [class*="shop"]');
      console.log(`Found ${locationContainers.length} potential location containers`);
      
      return results;
    });
    
    console.log(`Raw extraction found ${locations.length} locations`);
    
    // If we still haven't found locations, try clicking "Show all" or similar buttons
    if (locations.length === 0) {
      console.log('No locations found, looking for "Show all" button...');
      
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && (text.toLowerCase().includes('show all') || text.toLowerCase().includes('load more'))) {
          console.log(`Clicking button: ${text}`);
          await button.click();
          await delay(5000);
          break;
        }
      }
      
      // Try extraction again
      const retryLocations = await page.evaluate(() => {
        const windowAny = window as any;
        
        if (windowAny.__NEXT_DATA__?.props?.pageProps?.locations) {
          return windowAny.__NEXT_DATA__.props.pageProps.locations;
        }
        
        return [];
      });
      
      console.log(`Retry found ${retryLocations.length} locations`);
      
      if (retryLocations.length > 0) {
        await browser.close();
        return normalizeLocations(retryLocations);
      }
    }
    
    await browser.close();
    
    if (locations.length === 0) {
      console.log('WARNING: No locations were found. The page structure may have changed.');
      return [];
    }
    
    // Normalize the location data
    return normalizeLocations(locations);
    
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
        console.log('No locations found! Check server/page-debug.html for the page structure.');
        process.exit(1);
      }
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'server', 'scraped-london-locations.json');
      await fs.writeFile(
        outputPath,
        JSON.stringify(locations, null, 2)
      );
      
      console.log(`✅ Successfully scraped ${locations.length} locations!`);
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
