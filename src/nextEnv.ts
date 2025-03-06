export const nextEnv = {
  // Database connection info
  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_PORT: process.env.POSTGRES_PORT!,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE!,

  // Railway specific environment variables
  DATABASE_URL: process.env.DATABASE_URL,
};
