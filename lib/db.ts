import { neon } from "@neondatabase/serverless"

// Directly use the connection string for testing
const connectionString =
  "postgres://neondb_owner:npg_sJzW6E7QUyTm@ep-summer-unit-a4hsfd6f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

// Create a SQL client with the connection string
export const sql = neon(connectionString)

// Helper function to execute a query and return the results
export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  try {
    return (await sql.query(queryString, params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    // Return an empty array instead of throwing an error
    // This allows the application to continue functioning even if the database is unavailable
    return [] as T[]
  }
}
