import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as brezcodeSchema from "@shared/brezcode-schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create separate connection pool for BrezCode health platform
export const brezcodePool = new Pool({ 
  connectionString: process.env.DATABASE_URL + "?schema=brezcode"
});

export const brezcodeDb = drizzle({ 
  client: brezcodePool, 
  schema: brezcodeSchema 
});

export type BrezcodeDb = typeof brezcodeDb;