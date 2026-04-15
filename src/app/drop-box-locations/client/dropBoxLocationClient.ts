"use client";

import {
  createClientResource,
  useClientResourceList,
  useClientResourceSidePanelFormState,
} from "our-lib";
import {
  createDropBoxLocationAction,
  listDropBoxLocationsAction,
  updateDropBoxLocationAction,
} from "@/drop-box-locations/actions";
import { toDropBoxLocationInput } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

export const DROP_BOX_LOCATION_QUERY_KEY = ["drop-box-locations"] as const;

export const dropBoxLocationClient = createClientResource<DropBoxLocationRecord, DropBoxLocationInput>({
  resource: {
    profile: dropBoxLocationProfile,
    toInput: toDropBoxLocationInput,
    entityLabel: "location",
  },
  queryKey: DROP_BOX_LOCATION_QUERY_KEY,
  list: listDropBoxLocationsAction,
  create: createDropBoxLocationAction,
  update: (record, input) => updateDropBoxLocationAction(record.locationId, input),
});

export const useDropBoxLocationCollection = (initialData: DropBoxLocationRecord[]) => {
  return useClientResourceList(dropBoxLocationClient, { initialData });
};

type UseDropBoxLocationFormStateOptions = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const useDropBoxLocationFormState = ({
  mode,
  record,
  isOpen,
  onClose,
}: UseDropBoxLocationFormStateOptions) => {
  return useClientResourceSidePanelFormState(dropBoxLocationClient, {
    mode,
    record,
    isOpen,
    onClose,
  });
};
