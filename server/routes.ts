import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapePretLocations } from "./scrape-pret";
import type { Location } from "@shared/schema";

// Cache locations to avoid re-scraping on every request
let cachedLocations: Location[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/locations", async (req, res) => {
    try {
      const now = Date.now();
      
      // Use cache if available and not expired
      if (cachedLocations && (now - lastFetchTime) < CACHE_DURATION) {
        return res.json({ success: true, locations: cachedLocations });
      }

      // Scrape fresh data
      const locations = await scrapePretLocations();
      
      if (locations.length === 0) {
        // Return mock data as fallback
        const { mockLocations } = await import("../client/src/lib/mockData");
        return res.json({ 
          success: false,
          message: "Unable to fetch live data. Using fallback data.",
          locations: mockLocations 
        });
      }

      // Update cache
      cachedLocations = locations;
      lastFetchTime = now;

      res.json({ success: true, locations });
    } catch (error) {
      console.error("Error in /api/locations:", error);
      
      // Return cached data if available, otherwise mock data
      if (cachedLocations) {
        return res.json({ success: true, locations: cachedLocations });
      }
      
      const { mockLocations } = await import("../client/src/lib/mockData");
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch locations",
        locations: mockLocations
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
