-- Remove the line that adds the icon column since it already exists
ALTER TABLE "categories" ADD COLUMN "isExpense" boolean DEFAULT true NOT NULL;--> statement-breakpoint

-- Add new income categories
INSERT INTO "categories" ("name", "order", "icon", "isExpense") VALUES ('Paycheck', 1, 'hand-coins', FALSE);--> statement-breakpoint
INSERT INTO "categories" ("name", "order", "icon", "isExpense") VALUES ('Gift', 2, 'gift', FALSE);--> statement-breakpoint

-- Update existing categories order to avoid conflicts with new categories
UPDATE "categories" SET "order" = "order" + 2 WHERE "name" != 'Paycheck' AND "name" != 'Gift';