CREATE TABLE "exchangeRates" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"lastUpdatedAt" timestamp with time zone NOT NULL
);
