import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const auditLogTable = pgTable("AuditLog", {
  server: text("Server").notNull(),
  shortNote: text("ShortNote").notNull(),
  longNote: text("LongNote"),
  time: timestamp("Time", { withTimezone: false }).notNull(),
  source: text("Source").notNull(),
  category: text("Category").notNull(),
  severity: text("Severity").notNull(),
  route: text("Route").notNull(),
  userId: text("UserID").notNull(),
});
