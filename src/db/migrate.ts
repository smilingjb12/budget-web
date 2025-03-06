import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Load environment variables from .env.local file
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Migration started...");

  // Initialize PostgreSQL connection pool
  let connectionConfig;

  // Prefer DATABASE_URL if available (for both local and production)
  if (process.env.DATABASE_URL) {
    console.log("Using DATABASE_URL for connection");
    connectionConfig = {
      connectionString: process.env.DATABASE_URL,
      // Only use SSL in production
      ...(process.env.NODE_ENV === "production" && {
        ssl: { rejectUnauthorized: false },
      }),
    };
  } else {
    // Fallback to individual parameters if DATABASE_URL is not available
    console.log("Using individual connection parameters");
    connectionConfig = {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    };
  }

  console.log("connectionConfig:", connectionConfig);
  const pool = new Pool(connectionConfig);

  const db = drizzle(pool);

  // Run migrations
  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Migration completed successfully");

  // Close the pool
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
