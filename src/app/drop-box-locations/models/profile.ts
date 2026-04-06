import { defineResourceProfile } from "our-lib";
import { loadDistrictManagerOptions } from "@/drop-box-locations/models/lookupData";
import {
  dropBoxLocationInputSchema,
  locationStatusOptions,
  serviceLevelOptions,
  type DropBoxLocationInput,
  type DropBoxLocationRecord,
} from "@/drop-box-locations/models/schemas";

export const dropBoxLocationProfile = defineResourceProfile<DropBoxLocationRecord, DropBoxLocationInput>({
  entityName: "dropBoxLocation",
  inputSchema: dropBoxLocationInputSchema,
  getRecordId: (record) => record.locationId,
  getUpdatedAt: (record) => record.updatedAt,
  getUpdatedBy: (record) => record.updatedBy,
  getFormTitle: (mode, record) => (mode === "create" ? "Create Drop Box Location" : `Edit ${record?.locationName ?? "drop box location"}`),
  getSubmitLabel: (mode) => (mode === "create" ? "Create location" : "Save location"),
  cardFields: [
    { section: "Identity", label: "Location", prominent: true, value: (record) => record.locationName },
    { section: "Identity", label: "Location ID", value: (record) => record.locationId },
    { section: "Identity", label: "Campus", value: (record) => record.campus },
    { section: "Routing", label: "Building", value: (record) => record.building },
    { section: "Routing", label: "Zone", value: (record) => record.zone },
    { section: "Routing", label: "Pickup Window", value: (record) => record.pickupWindow },
    { section: "Operations", label: "Service Level", value: (record) => record.serviceLevel },
    { section: "Operations", label: "Capacity", value: (record) => `${record.currentLoad}/${record.capacity}` },
    { section: "Operations", label: "Status", value: (record) => record.status },
    { section: "Support", label: "District Manager", value: (record) => record.districtManager },
    { section: "Support", label: "Climate Zone", value: (record) => record.climateZone },
    { section: "Support", label: "Notes", value: (record) => record.notes },
  ],
  formFields: [
    { key: "locationName", label: "Location Name", kind: "text" },
    { key: "campus", label: "Campus", kind: "text" },
    { key: "building", label: "Building", kind: "text" },
    { key: "zone", label: "Zone", kind: "text" },
    { key: "serviceLevel", label: "Service Level", kind: "select", options: [...serviceLevelOptions] },
    { key: "pickupWindow", label: "Pickup Window", kind: "text" },
    { key: "capacity", label: "Capacity", kind: "number" },
    { key: "currentLoad", label: "Current Load", kind: "number" },
    { key: "status", label: "Status", kind: "select", options: [...locationStatusOptions] },
    { key: "accessCode", label: "Access Code", kind: "text" },
    {
      key: "districtManager",
      label: "District Manager",
      kind: "async-combobox",
      loadOptions: loadDistrictManagerOptions,
      placeholder: "Search district managers",
    },
    { key: "climateZone", label: "Climate Zone", kind: "text" },
    { key: "notes", label: "Notes", kind: "textarea", colSpan: 2 },
  ],
});
