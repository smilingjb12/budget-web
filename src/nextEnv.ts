export const nextEnv = {
  // Database connection info - prefer DATABASE_URL if available
  DATABASE_URL: process.env.DATABASE_URL,

  // Fallback individual connection parameters
  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_PORT: process.env.POSTGRES_PORT!,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE!,
};
