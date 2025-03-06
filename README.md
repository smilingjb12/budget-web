# Budget App

A personal budget tracking application built with Next.js, PostgreSQL, and Drizzle ORM.

## Local Development

1. Clone the repository
2. Copy `.env.sample` to `.env.local` and update the environment variables
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Database Setup

### Local Development
1. Make sure PostgreSQL is installed and running
2. Update the database connection parameters in `.env.local`
3. Run migrations: `npm run db:migrate`

### Generate Migrations
To generate new migrations after schema changes:
```bash
npm run db:generate
```

## Deployment on Railway

### Setting Up PostgreSQL on Railway

1. Create a new PostgreSQL database service on Railway
2. Railway will automatically provide the `DATABASE_URL` environment variable

### Environment Variables

Make sure the following environment variables are set in your Railway project:

- `DATABASE_URL` (automatically provided by Railway PostgreSQL plugin)
- `NODE_ENV=production`

### Database Migration on Railway

The migration script (`src/db/migrate.ts`) is configured to detect production environment and use the correct database connection:

```typescript
// Check if running in production (which we'll assume is Railway)
const isProduction = process.env.NODE_ENV === "production";

let connectionConfig;

if (isProduction && process.env.DATABASE_URL) {
  console.log("Using production database configuration");
  // In production, use the DATABASE_URL provided by Railway
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // For local development, use individual connection parameters
  // ...
}
```

This allows the migration to run successfully during deployment without modifying any other files.

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Make sure the PostgreSQL service is running on Railway
2. Verify that the `DATABASE_URL` environment variable is correctly set
3. Check the application logs for specific error messages
