import type { RecordRepository } from "our-lib";
import {
  InMemoryDropBoxLocationRepository,
  ProductionDropBoxLocationRepository,
} from "@/drop-box-locations/data/dropBoxLocationRepository";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

const createRepositoryForEnvironment = (): RecordRepository<
  DropBoxLocationRecord,
  DropBoxLocationInput,
  DropBoxLocationInput
> => {
  if (process.env.NODE_ENV === "production") {
    return new ProductionDropBoxLocationRepository();
  }

  return new InMemoryDropBoxLocationRepository();
};

const repository = createRepositoryForEnvironment();

const hasMarketingBigNumber = (locationId: string) => {
  const digitsOnly = locationId.replace(/[^\d]/g, "");
  return /^10{2,}$/.test(digitsOnly);
};

export type DropBoxLocationService = {
  repository: RecordRepository<DropBoxLocationRecord, DropBoxLocationInput, DropBoxLocationInput>;
  getMarketingBigNumberLocationIds: () => Promise<string[]>;
};

export const createDropBoxLocationService = (
) => {
  return {
    repository: repository,
    getMarketingBigNumberLocationIds: async () => {
      const result = await repository.list();
      return result.items
        .map((record) => record.locationId)
        .filter((locationId) => hasMarketingBigNumber(locationId));
    },
  } satisfies DropBoxLocationService;
};

