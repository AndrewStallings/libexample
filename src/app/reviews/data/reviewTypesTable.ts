import "server-only";

import { pgTable, text } from "drizzle-orm/pg-core";

export const reviewTypesTable = pgTable("ReviewTypes", {
  reviewTypeId: text("ReviewTypeID").primaryKey(),
  type: text("Type").notNull(),
});
