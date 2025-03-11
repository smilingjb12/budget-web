# Budget App

A personal budget tracking application built with Next.js, PostgreSQL, and Drizzle ORM.

![Screenshot_20250311_225541_Chrome](https://github.com/user-attachments/assets/20160066-d5cf-4558-a6a6-a25ded3f3d2d)
![Screenshot_20250311_225622_Chrome](https://github.com/user-attachments/assets/4605dde6-9750-4e2a-9956-ba465765bb58)


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

For Railway deployment, you only need:
- `DATABASE_URL` (automatically provided by Railway PostgreSQL plugin)
- `NODE_ENV=production` (set this manually if not already set)

### Database Connection

The application uses a simple, consistent approach for database connections:

```typescript
// Prefer DATABASE_URL if available (for both local and production)
if (process.env.DATABASE_URL) {
  console.log("Using DATABASE_URL for connection");
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    // Only use SSL in production
    ...(process.env.NODE_ENV === "production" && { ssl: { rejectUnauthorized: false } })
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
```

This approach works for both local development and production environments.

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Make sure the PostgreSQL service is running
2. Verify that either `DATABASE_URL` or the individual connection parameters are correctly set
3. Check the application logs for specific error messages
