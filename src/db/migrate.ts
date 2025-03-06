import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, PoolConfig } from "pg";

// Load environment variables from .env.local file
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Migration started...");

  // Initialize PostgreSQL connection pool
  // Check if running in production (which we'll assume is Railway)
  const isProduction = process.env.NODE_ENV === "production";
  let connectionConfig: PoolConfig;

  if (isProduction) {
    console.log("Using production database configuration");
    // In production, use the DATABASE_URL provided by Railway
    connectionConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    console.log("Using local database configuration");
    // For local development, use the individual connection parameters
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
