import type { SelectOption } from "our-lib";

export type ReviewType = {
  reviewTypeId: string;
  type: string;
};

export const reviewerOptions: SelectOption[] = [
  { value: "u-01", label: "Alex Carter" },
  { value: "u-02", label: "Morgan Lee" },
  { value: "u-03", label: "Jamie Patel" },
];

export const reviewTypes: ReviewType[] = [
  { reviewTypeId: "rt-01", type: "Editorial" },
  { reviewTypeId: "rt-02", type: "Compliance" },
  { reviewTypeId: "rt-03", type: "Release Gate" },
];
