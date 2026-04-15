"use client";

import { createClientResource, useClientResourceList } from "our-lib";
import {
  createSampleRecordAction,
  listSampleRecordsAction,
  updateSampleRecordAction,
} from "@/app/sample-records/actions";
import { sampleRecordProfile } from "@/app/sample-records/models/profile";
import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";
import { toSampleRecordInput } from "@/app/sample-records/models/toSampleRecordInput";

export const SAMPLE_RECORDS_QUERY_KEY = ["sample-records"] as const;

export const sampleRecordClient = createClientResource<SampleRecord, SampleRecordInput>({
  resource: {
    profile: sampleRecordProfile,
    toInput: toSampleRecordInput,
    entityLabel: "record",
  },
  queryKey: SAMPLE_RECORDS_QUERY_KEY,
  list: listSampleRecordsAction,
  create: createSampleRecordAction,
  update: (record, input) => updateSampleRecordAction(record.sampleRecordId, input),
});

export const useSampleRecordCollection = (initialData: SampleRecord[]) => {
  return useClientResourceList(sampleRecordClient, { initialData });
};
