import { InMemoryAuditLogger } from "our-lib";
import { InMemoryDropBoxLocationRepository, initialDropBoxLocations } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

export const createDropBoxLocationDemoService = () => {
  return createDropBoxLocationService(new InMemoryDropBoxLocationRepository(), new InMemoryAuditLogger());
};

export const getDropBoxLocationById = (locationId: string): DropBoxLocationRecord | undefined => {
  return initialDropBoxLocations.find((record) => record.locationId === locationId);
};

export const toDropBoxLocationInput = (record?: DropBoxLocationRecord): DropBoxLocationInput => {
  return {
    locationName: record?.locationName ?? "",
    campus: record?.campus ?? "",
    building: record?.building ?? "",
    zone: record?.zone ?? "",
    serviceLevel: record?.serviceLevel ?? "daily",
    pickupWindow: record?.pickupWindow ?? "",
    capacity: record?.capacity ?? 0,
    currentLoad: record?.currentLoad ?? 0,
    status: record?.status ?? "active",
    accessCode: record?.accessCode ?? "",
    districtManager: record?.districtManager ?? "",
    climateZone: record?.climateZone ?? "",
    notes: record?.notes ?? "",
  };
};
