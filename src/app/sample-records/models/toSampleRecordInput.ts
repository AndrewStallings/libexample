import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";

export const toSampleRecordInput = (record?: SampleRecord): SampleRecordInput => {
  return {
    title: record?.title ?? "",
    groupName: record?.groupName ?? "",
    ownerName: record?.ownerName ?? "",
    status: record?.status ?? "active",
    notes: record?.notes ?? "",
  };
};
