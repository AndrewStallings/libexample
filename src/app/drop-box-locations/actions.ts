"use server";

import type { DropBoxLocationInput } from "@/drop-box-locations/models/schemas";
import {
  createDropBoxLocation,
  listDropBoxLocations,
  updateDropBoxLocation,
} from "@/drop-box-locations/services/dropBoxLocationService";

export const listDropBoxLocationsAction = async () => {
  return listDropBoxLocations();
};

export const createDropBoxLocationAction = async (input: DropBoxLocationInput) => {
  return createDropBoxLocation(input);
};

export const updateDropBoxLocationAction = async (locationId: string, input: DropBoxLocationInput) => {
  return updateDropBoxLocation(locationId, input);
};
