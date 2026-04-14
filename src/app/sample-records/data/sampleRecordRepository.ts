import { createInMemoryTableRepository } from "our-lib";
import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";

export const initialSampleRecords: SampleRecord[] = [
  {
    sampleRecordId: "SR-100",
    title: "Primary Campaign",
    groupName: "North Team",
    ownerName: "Alex Stone",
    status: "active",
    notes: "Tracks the default active record for the example table.",
    updatedAt: "2026-04-10T10:00:00.000Z",
    updatedBy: "Alex Stone",
  },
  {
    sampleRecordId: "SR-200",
    title: "Fallback Queue",
    groupName: "Operations",
    ownerName: "Morgan Lee",
    status: "paused",
    notes: "Used to show a second card with a different status.",
    updatedAt: "2026-04-09T08:30:00.000Z",
    updatedBy: "Morgan Lee",
  },
];

const createNextSampleRecordId = (currentItems: SampleRecord[]) => {
  const currentMaxId = currentItems.reduce((maxValue, record) => {
    const numericId = Number.parseInt(record.sampleRecordId.replace(/[^\d]/g, ""), 10);
    return Number.isNaN(numericId) ? maxValue : Math.max(maxValue, numericId);
  }, 0);

  return `SR-${currentMaxId + 100}`;
};

export const createSampleRecordRepository = () => {
  return createInMemoryTableRepository<SampleRecord, SampleRecordInput, "sampleRecordId">({
    initialItems: initialSampleRecords,
    idKey: "sampleRecordId",
    createId: createNextSampleRecordId,
    getUpdatedBy: (input) => input.ownerName,
  });
};
