import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable("Reviews", {
  reviewId: text("ReviewID").primaryKey(),
  subject: text("Subject").notNull(),
  reviewerId: text("ReviewerID").notNull(),
  reviewTypeId: text("ReviewTypeID").notNull(),
  rating: integer("Rating").notNull(),
  status: text("Status").notNull(),
  summary: text("Summary").notNull(),
  updatedAt: timestamp("UpdatedAt", { withTimezone: false }).notNull(),
});
