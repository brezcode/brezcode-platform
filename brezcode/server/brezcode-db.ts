// BREZCODE DATABASE CONNECTION
// Separate database connection for BrezCode health platform

import { drizzle } from 'drizzle-orm/neon-serverless'
import * as brezcodeSchema from '../../shared/brezcode-schema'

// Use existing DATABASE_URL for now, but in production this should be BREZCODE_DATABASE_URL
const connectionString = process.env.DATABASE_URL || process.env.BREZCODE_DATABASE_URL

if (!connectionString) {
  throw new Error('BrezCode database connection string not found')
}

export const db = drizzle(connectionString, { 
  schema: brezcodeSchema 
})

// Export all BrezCode schema types and tables
export * from '../../shared/brezcode-schema'