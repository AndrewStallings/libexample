import "server-only";

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const dropBoxLocationsTable = pgTable("DropBoxLocations", {
  locationId: text("LocationID").primaryKey(),
  locationName: text("LocationName").notNull(),
  campus: text("Campus").notNull(),
  building: text("Building").notNull(),
  zone: text("Zone").notNull(),
  serviceLevel: text("ServiceLevel").notNull(),
  pickupWindow: text("PickupWindow").notNull(),
  capacity: integer("Capacity").notNull(),
  currentLoad: integer("CurrentLoad").notNull(),
  status: text("Status").notNull(),
  accessCode: text("AccessCode").notNull(),
  districtManager: text("DistrictManager").notNull(),
  climateZone: text("ClimateZone").notNull(),
  notes: text("Notes").notNull(),
  updatedAt: timestamp("UpdatedAt", { withTimezone: false }).notNull(),
  updatedBy: text("UpdatedBy").notNull(),
});
