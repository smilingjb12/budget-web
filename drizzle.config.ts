import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

// Load environment variables from .env.local file
dotenv.config({ path: ".env.local" });

export default {
  schema: "./src/db/schema/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
  },
} satisfies Config;
