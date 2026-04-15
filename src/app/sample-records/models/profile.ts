import { defineResourceProfile } from "our-lib";
import { sampleRecordInputSchema, sampleRecordStatusOptions } from "@/app/sample-records/models/schemas";
import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";

export const sampleRecordProfile = defineResourceProfile<SampleRecord, SampleRecordInput>({
  entityName: "sampleRecord",
  inputSchema: sampleRecordInputSchema,
  getRecordId: (record) => record.sampleRecordId,
  getUpdatedAt: (record) => record.updatedAt,
  getUpdatedBy: (record) => record.updatedBy,
  getFormTitle: (mode, record) => (mode === "create" ? "Create Sample Record" : `Edit ${record?.title ?? "sample record"}`),
  getSubmitLabel: (mode) => (mode === "create" ? "Create record" : "Save record"),
  cardFields: [
    { section: "Primary", label: "Title", prominent: true, value: (record) => record.title },
    { section: "Primary", label: "Record ID", value: (record) => record.sampleRecordId },
    { section: "Primary", label: "Group", value: (record) => record.groupName },
    { section: "Details", label: "Owner", value: (record) => record.ownerName },
    { section: "Details", label: "Status", value: (record) => record.status },
    { section: "Details", label: "Notes", value: (record) => record.notes },
  ],
  formFields: [
    { key: "title", label: "Title", kind: "text" },
    { key: "groupName", label: "Group", kind: "text" },
    { key: "ownerName", label: "Owner", kind: "text" },
    { key: "status", label: "Status", kind: "select", options: [...sampleRecordStatusOptions] },
    { key: "notes", label: "Notes", kind: "textarea", colSpan: 2 },
  ],
});
