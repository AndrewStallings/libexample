import "server-only";

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const booksTable = pgTable("Books", {
  bookId: text("BookID").primaryKey(),
  title: text("Title").notNull(),
  status: text("Status").notNull(),
  ownerId: text("OwnerID").notNull(),
  ownerName: text("OwnerName").notNull(),
  notes: text("Notes").notNull(),
  updatedAt: timestamp("UpdatedAt", { withTimezone: false }).notNull(),
  updatedBy: text("UpdatedBy").notNull(),
});
