import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as leadgenSchema from "@shared/leadgen-schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create separate connection pool for LeadGen.to platform
export const leadgenPool = new Pool({ 
  connectionString: process.env.DATABASE_URL + "?schema=leadgen" 
});

export const leadgenDb = drizzle({ 
  client: leadgenPool, 
  schema: leadgenSchema 
});

export type LeadgenDb = typeof leadgenDb;