import { describe, expect, it, vi } from "vitest";
import { InMemoryDropBoxLocationRepository } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { dropBoxLocationInputSchema } from "@/drop-box-locations/models/schemas";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";
import { createDropBoxLocationResourceService, createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";

describe("InMemoryDropBoxLocationRepository", () => {
  it("creates a drop box location", async () => {
    const repository = new InMemoryDropBoxLocationRepository();

    const created = await repository.create(
      dropBoxLocationInputSchema.parse({
        locationName: "City Library Annex",
        campus: "City Library",
        building: "Annex",
        zone: "C2",
        serviceLevel: "weekly",
        pickupWindow: "14:00 - 16:00",
        capacity: 90,
        currentLoad: 14,
        status: "active",
        accessCode: "CLA-11",
        districtManager: "Jordan Kim",
        climateZone: "Indoor",
        notes: "Lower-volume annex location for weekly route pickup.",
      }),
    );

    expect(created.locationId).toBeTruthy();
    expect(created.districtManager).toBe("Jordan Kim");
  });
});

describe("createDropBoxLocationService", () => {
  it("creates a drop box location and writes an audit log", async () => {
    const service = createDropBoxLocationService();
    const existingEntryCount = service.logging.getEntries().length;

    const created = await service.resource.create(
      dropBoxLocationInputSchema.parse({
        locationName: "West Branch Side Entry",
        campus: "West Campus",
        building: "Library West",
        zone: "B2",
        serviceLevel: "daily",
        pickupWindow: "09:00 - 11:00",
        capacity: 140,
        currentLoad: 32,
        status: "active",
        accessCode: "WBS-22",
        districtManager: "Jordan Kim",
        climateZone: "Indoor",
        notes: "Marketing requested audit coverage for branch-side intake.",
      }),
      "dropbox-test-user",
    );
    const loggedEntry = service.logging.getEntries()[existingEntryCount];

    expect(created.locationId).toBeTruthy();
    expect(loggedEntry?.shortNote).toBe("dropBoxLocation created");
    expect(loggedEntry?.userId).toBe("dropbox-test-user");
  });

  it("logs validation failures before rethrowing them", async () => {
    const service = createDropBoxLocationService();
    const existingEntryCount = service.logging.getEntries().length;

    await expect(
      service.resource.create(
        {
          locationName: "No",
          campus: "",
          building: "",
          zone: "",
          serviceLevel: "daily",
          pickupWindow: "",
          capacity: 10,
          currentLoad: 1,
          status: "active",
          accessCode: "A",
          districtManager: "",
          climateZone: "",
          notes: "short",
        } as DropBoxLocationInput,
        "dropbox-test-user",
      ),
    ).rejects.toThrowError();

    const loggedEntry = service.logging.getEntries()[existingEntryCount];

    expect(loggedEntry?.shortNote).toBe("dropBoxLocation create failed");
    expect(loggedEntry?.severity).toBe("error");
    expect(loggedEntry?.userId).toBe("dropbox-test-user");
  });

  it("returns ids with marketing-friendly big numbers", async () => {
    const records: DropBoxLocationRecord[] = [
      {
        locationId: "DB-100",
        locationName: "Campaign 100",
        campus: "North Campus",
        building: "Main Hall",
        zone: "A1",
        serviceLevel: "daily",
        pickupWindow: "08:00 - 10:00",
        capacity: 120,
        currentLoad: 64,
        status: "active",
        accessCode: "AAA-10",
        districtManager: "Sally Grant",
        climateZone: "Indoor",
        notes: "",
        updatedAt: "2026-03-28T09:00:00.000Z",
        updatedBy: "Sally Grant",
      },
      {
        locationId: "DB-1000",
        locationName: "Campaign 1000",
        campus: "North Campus",
        building: "Main Hall",
        zone: "A2",
        serviceLevel: "daily",
        pickupWindow: "08:00 - 10:00",
        capacity: 120,
        currentLoad: 64,
        status: "active",
        accessCode: "AAA-11",
        districtManager: "Sally Grant",
        climateZone: "Indoor",
        notes: "",
        updatedAt: "2026-03-28T09:00:00.000Z",
        updatedBy: "Sally Grant",
      },
      {
        locationId: "DB-7001",
        locationName: "Regular Location",
        campus: "North Campus",
        building: "Main Hall",
        zone: "A3",
        serviceLevel: "daily",
        pickupWindow: "08:00 - 10:00",
        capacity: 120,
        currentLoad: 64,
        status: "active",
        accessCode: "AAA-12",
        districtManager: "Sally Grant",
        climateZone: "Indoor",
        notes: "",
        updatedAt: "2026-03-28T09:00:00.000Z",
        updatedBy: "Sally Grant",
      },
      {
        locationId: "DB-1000000000",
        locationName: "Campaign Billion",
        campus: "North Campus",
        building: "Main Hall",
        zone: "A4",
        serviceLevel: "daily",
        pickupWindow: "08:00 - 10:00",
        capacity: 120,
        currentLoad: 64,
        status: "active",
        accessCode: "AAA-13",
        districtManager: "Sally Grant",
        climateZone: "Indoor",
        notes: "",
        updatedAt: "2026-03-28T09:00:00.000Z",
        updatedBy: "Sally Grant",
      },
    ];

    const service = createDropBoxLocationService();
    vi.spyOn(service.repository, "list").mockResolvedValue({
      items: records,
      total: records.length,
    });

    await expect(service.getMarketingBigNumberLocationIds()).resolves.toEqual(["DB-100", "DB-1000", "DB-1000000000"]);
  });

  it("builds resource helpers from the service factory", () => {
    const resource = createDropBoxLocationResourceService();

    expect(resource).toHaveProperty("list");
    expect(resource).toHaveProperty("getById");
    expect(resource).toHaveProperty("create");
    expect(resource).toHaveProperty("update");
    expect(resource).toHaveProperty("validate");
  });
});
