import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pretLocations } from "./pret-locations-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all Pret locations
  app.get("/api/locations", async (req, res) => {
    try {
      // Return real Pret UK locations
      res.json({ success: true, locations: pretLocations });
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
