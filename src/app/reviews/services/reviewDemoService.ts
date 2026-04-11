import { InMemoryReviewRepository, initialReviewRows } from "@/reviews/data/reviewRepository";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import type { ReviewInput, ReviewRecord } from "@/reviews/models/schemas";
import { createReviewService } from "@/reviews/services/reviewService";
import { createAppAuditLogger } from "@/config/auditLogger";

const toReviewRecord = (row: (typeof initialReviewRows)[number]): ReviewRecord => {
  const reviewType = reviewTypes.find((item) => item.reviewTypeId === row.reviewTypeId);
  const reviewer = reviewerOptions.find((item) => item.value === row.reviewerId);

  return {
    reviewId: row.reviewId,
    subject: row.subject,
    reviewerId: row.reviewerId,
    reviewerName: reviewer?.label ?? row.reviewerId,
    reviewTypeId: row.reviewTypeId,
    reviewTypeName: reviewType?.type ?? row.reviewTypeId,
    rating: row.rating,
    status: row.status,
    summary: row.summary,
    updatedAt: row.updatedAt,
  };
};

const createReviewDemoStore = () => {
  const repository = new InMemoryReviewRepository();

  return {
    repository,
    service: createReviewService(repository, createAppAuditLogger()),
  };
};

let reviewDemoStore = createReviewDemoStore();

export const createReviewDemoService = () => {
  return reviewDemoStore.service;
};

export const listReviews = async (): Promise<ReviewRecord[]> => {
  const result = await reviewDemoStore.service.list();
  return result.items;
};

export const getReviewRecordById = async (reviewId: string): Promise<ReviewRecord | undefined> => {
  return (await reviewDemoStore.service.getById(reviewId)) ?? undefined;
};

export const resetReviewDemoStore = () => {
  reviewDemoStore = createReviewDemoStore();
};

export const getReviewById = (reviewId: string): ReviewRecord | undefined => {
  const row = initialReviewRows.find((item) => item.reviewId === reviewId);
  return row ? toReviewRecord(row) : undefined;
};

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
