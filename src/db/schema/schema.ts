import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: text().notNull(),
  order: integer().notNull(),
  icon: text().notNull(),
});

export const records = pgTable(
  "records",
  {
    id: serial().primaryKey(),
    categoryId: integer()
      .notNull()
      .references(() => categories.id),
    isExpense: boolean().notNull().default(true),
    value: decimal({
      precision: 10,
      scale: 2,
    }).notNull(),
    comment: text(),
    date: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [
    index("category_id_idx").on(table.categoryId),
    index("date_idx").on(table.date),
    index("is_expense_idx").on(table.isExpense),
  ]
);
