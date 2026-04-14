import { z } from "zod";
import { createWorkflowService, type AuditLogger, type RecordRepository } from "our-lib";
import { InMemoryReviewRepository, initialReviewRows } from "@/reviews/data/reviewRepository";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import { reviewInputSchema, type ReviewInput, type ReviewRecord } from "@/reviews/models/schemas";

const repository = new InMemoryReviewRepository();

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

export type ReviewService = {
  repository: InMemoryReviewRepository;
};

export const createReviewService = () => {
  return {
    repository,
  } satisfies ReviewService;
};

export const createReviewResourceService = (
  repository: RecordRepository<ReviewRecord, ReviewInput, ReviewInput>,
  logger: AuditLogger,
) => {
  return createWorkflowService({
    entityName: "review",
    repository,
    logger,
    route: "/reviews",
    source: "reviewService",
    getEntityId: (record) => record.reviewId,
    inputSchema: reviewInputSchema,
  });
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

export const isReviewValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
