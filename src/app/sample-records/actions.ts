"use server";

import type { SampleRecordInput } from "@/app/sample-records/models/schemas";
import { createSampleRecord, listSampleRecords, updateSampleRecord } from "@/app/sample-records/services/sampleRecordService";

export const listSampleRecordsAction = async () => {
  return listSampleRecords();
};

export const createSampleRecordAction = async (input: SampleRecordInput) => {
  return createSampleRecord(input);
};

export const updateSampleRecordAction = async (sampleRecordId: string, input: SampleRecordInput) => {
  return updateSampleRecord(sampleRecordId, input);
};
