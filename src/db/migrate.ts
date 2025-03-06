import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Load environment variables from .env.local file
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Migration started...");

  // Initialize PostgreSQL connection pool
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  });

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
