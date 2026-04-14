import { datetime2, int, mssqlTable, nvarchar } from "drizzle-orm/mssql-core";

export const auditLogTable = mssqlTable("AuditLog", {
  auditLogId: int("AuditLogID").identity().primaryKey(),
  server: nvarchar("Server", { length: 128 }).notNull(),
  shortNote: nvarchar("ShortNote", { length: 255 }).notNull(),
  longNote: nvarchar("LongNote", { length: "max" }),
  time: datetime2("Time").notNull(),
  source: nvarchar("Source", { length: 255 }).notNull(),
  category: nvarchar("Category", { length: 128 }).notNull(),
  severity: nvarchar("Severity", { length: 32 }).notNull(),
  route: nvarchar("Route", { length: 255 }).notNull(),
  userId: nvarchar("UserID", { length: 255 }).notNull(),
});
