ALTER TABLE "records" ADD COLUMN "isExpense" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "is_expense_idx" ON "records" USING btree ("isExpense");