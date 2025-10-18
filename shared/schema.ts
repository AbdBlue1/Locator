import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(['open', 'closed', 'closing_soon']).optional(),
  openingHours: z.string().optional(),
  phone: z.string().optional(),
  brand: z.enum(['pret', 'sainsburys', 'tfl']),
  modes: z.array(z.string()).optional(), // For TfL: tube, overground, dlr, etc.
});

export type Location = z.infer<typeof locationSchema>;
export type InsertLocation = Omit<Location, 'id'>;
