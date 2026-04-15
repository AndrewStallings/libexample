import { initialReviewRows } from "@/reviews/data/reviewRepository";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import type { ReviewInput, ReviewRecord } from "@/reviews/models/schemas";
import { toReviewInput } from "@/reviews/models/toReviewInput";

export const createReviewInput = (overrides: Partial<ReviewInput> = {}): ReviewInput => {
  return {
    ...toReviewInput(),
    ...overrides,
  };
};

export const createReviewRecord = (overrides: Partial<ReviewRecord> = {}): ReviewRecord => {
  const baseRow = initialReviewRows.find((item) => item.reviewId === "RV-2001");
  if (!baseRow) {
    throw new Error("Expected demo review row RV-2001 to exist.");
  }

  const reviewType = reviewTypes.find((item) => item.reviewTypeId === baseRow.reviewTypeId);
  const reviewer = reviewerOptions.find((item) => item.value === baseRow.reviewerId);

  return {
    reviewId: baseRow.reviewId,
    subject: baseRow.subject,
    reviewerId: baseRow.reviewerId,
    reviewerName: reviewer?.label ?? baseRow.reviewerId,
    reviewTypeId: baseRow.reviewTypeId,
    reviewTypeName: reviewType?.type ?? baseRow.reviewTypeId,
    rating: baseRow.rating,
    status: baseRow.status,
    summary: baseRow.summary,
    updatedAt: baseRow.updatedAt,
    ...overrides,
  };
};
