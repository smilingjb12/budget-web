CREATE TABLE "regularPayments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" timestamp with time zone NOT NULL
);
