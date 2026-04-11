import { InMemoryDropBoxLocationRepository, initialDropBoxLocations } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

const createDropBoxLocationDemoStore = () => {
  const repository = new InMemoryDropBoxLocationRepository();

  return {
    repository,
    service: createDropBoxLocationService(repository, createAppAuditLogger()),
  };
};

let dropBoxLocationDemoStore = createDropBoxLocationDemoStore();

export const createDropBoxLocationDemoService = () => {
  return dropBoxLocationDemoStore.service;
};

export const listDropBoxLocations = async (): Promise<DropBoxLocationRecord[]> => {
  const result = await dropBoxLocationDemoStore.service.list();
  return result.items;
};

export const getDropBoxLocationRecordById = async (locationId: string): Promise<DropBoxLocationRecord | undefined> => {
  return (await dropBoxLocationDemoStore.service.getById(locationId)) ?? undefined;
};

export const resetDropBoxLocationDemoStore = () => {
  dropBoxLocationDemoStore = createDropBoxLocationDemoStore();
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
