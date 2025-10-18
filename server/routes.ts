import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pretLocations } from "./pret-locations-data";
import { sainsburysLocations } from "./sainsburys-locations-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all locations (Pret + Sainsbury's)
  app.get("/api/locations", async (req, res) => {
    try {
      // Combine both Pret and Sainsbury's locations
      const allLocations = [...pretLocations, ...sainsburysLocations];
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

  const httpServer = createServer(app);
  return httpServer;
}
