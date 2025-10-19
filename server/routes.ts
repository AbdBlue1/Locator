import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // No API routes needed - all data is static and bundled in the frontend
  
  const httpServer = createServer(app);
  return httpServer;
}
