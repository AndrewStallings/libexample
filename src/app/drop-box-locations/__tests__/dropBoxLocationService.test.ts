import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger } from "our-lib";
import { InMemoryDropBoxLocationRepository } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";

describe("createDropBoxLocationService", () => {
  it("creates a drop box location and writes an audit log", async () => {
    const repository = new InMemoryDropBoxLocationRepository();
    const logger = new InMemoryAuditLogger();
    const service = createDropBoxLocationService(repository, logger);

    const created = await service.create(
      {
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
      },
      "location-test-user",
    );

    expect(created.locationId).toBeTruthy();
    expect(logger.entries[0]?.shortNote).toBe("dropBoxLocation created");
  });
});
