import "server-only";

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const snacksTable = pgTable("Snacks", {
  snackId: text("SnackID").primaryKey(),
  name: text("Name").notNull(),
  category: text("Category").notNull(),
  priceCents: integer("PriceCents").notNull(),
  stockCount: integer("StockCount").notNull(),
  shelfLocation: text("ShelfLocation").notNull(),
  status: text("Status").notNull(),
  supplierName: text("SupplierName").notNull(),
  notes: text("Notes").notNull(),
  updatedAt: timestamp("UpdatedAt", { withTimezone: false }).notNull(),
  updatedBy: text("UpdatedBy").notNull(),
});
