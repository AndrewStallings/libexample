import type { EntityId, ListResult, RecordRepository } from "our-lib";
import { dropBoxLocationInputSchema, type DropBoxLocationInput, type DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

export const initialDropBoxLocations: DropBoxLocationRecord[] = [
  {
    locationId: "DB-7001",
    locationName: "North Campus Main Hall",
    campus: "North Campus",
    building: "Main Hall",
    zone: "A1",
    serviceLevel: "daily",
    pickupWindow: "08:00 - 10:00",
    capacity: 120,
    currentLoad: 64,
    status: "active",
    accessCode: "NCM-44",
    districtManager: "Sally Grant",
    climateZone: "Indoor",
    notes: "Primary student-facing drop box near the north entrance.",
    updatedAt: "2026-03-28T09:00:00.000Z",
    updatedBy: "Sally Grant",
  },
  {
    locationId: "DB-7002",
    locationName: "Warehouse Overflow Dock",
    campus: "Distribution Yard",
    building: "Warehouse 3",
    zone: "Dock West",
    serviceLevel: "twice-daily",
    pickupWindow: "11:00 / 16:00",
    capacity: 300,
    currentLoad: 188,
    status: "maintenance",
    accessCode: "WHY-19",
    districtManager: "Priya Shah",
    climateZone: "Semi-Controlled",
    notes: "Under maintenance due to scanner replacement and dock repainting.",
    updatedAt: "2026-03-29T13:30:00.000Z",
    updatedBy: "Priya Shah",
  },
];

export class InMemoryDropBoxLocationRepository implements RecordRepository<DropBoxLocationRecord, DropBoxLocationInput, DropBoxLocationInput> {
  private items = [...initialDropBoxLocations];

  list = async (): Promise<ListResult<DropBoxLocationRecord>> => {
    return {
      items: [...this.items],
      total: this.items.length,
    };
  };

  getById = async (id: EntityId): Promise<DropBoxLocationRecord | null> => {
    return this.items.find((item) => item.locationId === id) ?? null;
  };

  create = async (input: DropBoxLocationInput): Promise<DropBoxLocationRecord> => {
    const validated = dropBoxLocationInputSchema.parse(input);

    const created: DropBoxLocationRecord = {
      locationId: `DB-${7000 + this.items.length + 1}`,
      ...validated,
      updatedAt: new Date().toISOString(),
      updatedBy: validated.districtManager,
    };
    this.items.unshift(created);
    return created;
  };

  update = async (id: EntityId, input: DropBoxLocationInput): Promise<DropBoxLocationRecord> => {
    const validated = dropBoxLocationInputSchema.parse(input);
    const existing = this.items.find((item) => item.locationId === id);
    if (!existing) {
      throw new Error(`Drop box location ${id} was not found`);
    }

    const updated: DropBoxLocationRecord = {
      ...existing,
      ...validated,
      updatedAt: new Date().toISOString(),
      updatedBy: validated.districtManager,
    };
    
    this.items = this.items.map((item) => (item.locationId === id ? updated : item));
    return updated;
  };
}

export class ProductionDropBoxLocationRepository implements RecordRepository<
  DropBoxLocationRecord,
  DropBoxLocationInput,
  DropBoxLocationInput
> {
  list = async (): Promise<ListResult<DropBoxLocationRecord>> => {
    throw new Error("Production drop box location repository is not implemented yet.");
  };

  getById = async (_id: EntityId): Promise<DropBoxLocationRecord | null> => {
    throw new Error("Production drop box location repository is not implemented yet.");
  };

  create = async (_input: DropBoxLocationInput): Promise<DropBoxLocationRecord> => {
    throw new Error("Production drop box location repository is not implemented yet.");
  };

  update = async (_id: EntityId, _input: DropBoxLocationInput): Promise<DropBoxLocationRecord> => {
    throw new Error("Production drop box location repository is not implemented yet.");
  };
}

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
