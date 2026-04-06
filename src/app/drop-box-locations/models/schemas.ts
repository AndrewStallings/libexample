import { z } from "zod";
import { auditStampSchema } from "our-lib";

export const serviceLevelOptions = [
  { label: "Daily", value: "daily" },
  { label: "Twice Daily", value: "twice-daily" },
  { label: "Weekly", value: "weekly" },
] as const;

export const locationStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Paused", value: "paused" },
] as const;

export const dropBoxLocationRecordSchema = z.object({
  locationId: z.string(),
  locationName: z.string(),
  campus: z.string(),
  building: z.string(),
  zone: z.string(),
  serviceLevel: z.enum(["daily", "twice-daily", "weekly"]),
  pickupWindow: z.string(),
  capacity: z.number().int().min(0),
  currentLoad: z.number().int().min(0),
  status: z.enum(["active", "maintenance", "paused"]),
  accessCode: z.string(),
  districtManager: z.string(),
  climateZone: z.string(),
  notes: z.string(),
  ...auditStampSchema.shape,
});

export const dropBoxLocationInputSchema = z.object({
  locationName: z.string().min(3, "Location name is required"),
  campus: z.string().min(2, "Campus is required"),
  building: z.string().min(1, "Building is required"),
  zone: z.string().min(1, "Zone is required"),
  serviceLevel: z.enum(["daily", "twice-daily", "weekly"]),
  pickupWindow: z.string().min(3, "Pickup window is required"),
  capacity: z.coerce.number().int().min(0),
  currentLoad: z.coerce.number().int().min(0),
  status: z.enum(["active", "maintenance", "paused"]),
  accessCode: z.string().min(3, "Access code is required"),
  districtManager: z.string().min(2, "District manager is required"),
  climateZone: z.string().min(2, "Climate zone is required"),
  notes: z.string().min(8, "Notes should explain the location"),
});

export type DropBoxLocationRecord = z.infer<typeof dropBoxLocationRecordSchema>;
export type DropBoxLocationInput = z.infer<typeof dropBoxLocationInputSchema>;
