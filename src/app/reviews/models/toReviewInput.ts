import type { ReviewInput, ReviewRecord } from "@/reviews/models/schemas";

export const toReviewInput = (record?: ReviewRecord): ReviewInput => {
  return {
    subject: record?.subject ?? "",
    reviewerId: record?.reviewerId ?? "u-01",
    reviewTypeId: record?.reviewTypeId ?? "rt-01",
    rating: record?.rating ?? 3,
    status: record?.status ?? "open",
    summary: record?.summary ?? "",
  };
};
