import { load } from "cheerio";
import type { Location } from "@shared/schema";

export async function scrapePretLocations(): Promise<Location[]> {
  try {
    // Fetch all UK cities with Pret locations
    const cities = ["london", "manchester", "birmingham", "edinburgh", "bristol", "glasgow", "leeds", "liverpool", "newcastle"];
    const allLocations: Location[] = [];

    for (const city of cities) {
      try {
        const url = `https://www.pret.co.uk/en-GB/shop-finder/l/${city}`;
        const response = await fetch(url);
        const html = await response.text();

        // Extract JSON data from Next.js __NEXT_DATA__ script tag
        const $ = load(html);
        const nextDataScript = $('script#__NEXT_DATA__').html();
        
        if (nextDataScript) {
          const data = JSON.parse(nextDataScript);
          
          // Navigate through the Next.js data structure to find locations
          const pageProps = data?.props?.pageProps;
          
          if (pageProps?.shops && Array.isArray(pageProps.shops)) {
            const shops = pageProps.shops.map((shop: any, index: number) => ({
              id: shop.id || `${city}-${index + 1}`,
              name: shop.name || shop.title || "Pret A Manger",
              address: shop.address || shop.streetAddress || "",
              city: shop.city || city.charAt(0).toUpperCase() + city.slice(1),
              postcode: shop.postcode || shop.zipCode || "",
              latitude: parseFloat(shop.lat || shop.latitude || 0),
              longitude: parseFloat(shop.lng || shop.lon || shop.longitude || 0),
              status: shop.isOpen ? "open" : "closed",
              openingHours: shop.openingHours || shop.hours || undefined,
              phone: shop.phone || shop.telephone || undefined,
            }));
            
            allLocations.push(...shops);
          } else if (pageProps?.locations && Array.isArray(pageProps.locations)) {
            const locations = pageProps.locations.map((loc: any, index: number) => ({
              id: loc.id || `${city}-${index + 1}`,
              name: loc.name || loc.title || "Pret A Manger",
              address: loc.address || loc.streetAddress || "",
              city: loc.city || city.charAt(0).toUpperCase() + city.slice(1),
              postcode: loc.postcode || loc.zipCode || "",
              latitude: parseFloat(loc.lat || loc.latitude || 0),
              longitude: parseFloat(loc.lng || loc.lon || loc.longitude || 0),
              status: loc.isOpen ? "open" : "closed",
              openingHours: loc.openingHours || loc.hours || undefined,
              phone: loc.phone || loc.telephone || undefined,
            }));
            
            allLocations.push(...locations);
          }
        }
      } catch (cityError) {
        console.error(`Error fetching ${city}:`, cityError);
        continue;
      }
    }

    // Filter out invalid locations (no coordinates)
    return allLocations.filter(loc => loc.latitude !== 0 && loc.longitude !== 0);
  } catch (error) {
    console.error("Error scraping Pret locations:", error);
    return [];
  }
}
