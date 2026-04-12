import "server-only";

import { date, numeric, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const salesTable = pgTable("Sales", {
  saleId: text("SaleID").primaryKey(),
  bookId: text("BookID").notNull(),
  reviewerId: text("ReviewerID").notNull(),
  channelId: text("ChannelID").notNull(),
  saleType: text("SaleType").notNull(),
  quantity: integer("Quantity").notNull(),
  totalAmount: numeric("TotalAmount", { precision: 10, scale: 2 }).notNull(),
  saleDate: date("SaleDate").notNull(),
  storeLocation: text("StoreLocation"),
  marketplace: text("Marketplace"),
  orderId: text("OrderID"),
  createdBy: text("CreatedBy").notNull(),
  createdAt: timestamp("CreatedAt", { withTimezone: false }).notNull(),
  updatedBy: text("UpdatedBy").notNull(),
  updatedAt: timestamp("UpdatedAt", { withTimezone: false }).notNull(),
});
