import type { ReviewInput, ReviewRecord } from "@/reviews/models/schemas";
import { getReviewById, toReviewInput } from "@/reviews/services/reviewDemoService";

export const createReviewInput = (overrides: Partial<ReviewInput> = {}): ReviewInput => {
  return {
    ...toReviewInput(),
    ...overrides,
  };
};

export const createReviewRecord = (overrides: Partial<ReviewRecord> = {}): ReviewRecord => {
  const baseRecord = getReviewById("RV-2001");
  if (!baseRecord) {
    throw new Error("Expected demo review fixture RV-2001 to exist.");
  }

  return {
    ...baseRecord,
    ...overrides,
  };
};
