import "server-only";

import { z } from "zod";
import { createWorkflowService, type AuditLogger, type RecordRepository } from "our-lib";
import { InMemoryReviewRepository } from "@/reviews/data/reviewRepository";
import { reviewInputSchema, type ReviewInput, type ReviewRecord } from "@/reviews/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

type ReviewServiceDependencies = {
  repository: RecordRepository<ReviewRecord, ReviewInput, ReviewInput>;
  logger: AuditLogger;
};

const createReviewServiceDependencies = (): ReviewServiceDependencies => {
  return {
    repository: new InMemoryReviewRepository(),
    logger: createAppAuditLogger(),
  };
};

export type ReviewService = {
  repository: RecordRepository<ReviewRecord, ReviewInput, ReviewInput>;
  resource: ReturnType<typeof createReviewResourceService>;
  list: () => Promise<ReviewRecord[]>;
  getById: (reviewId: string) => Promise<ReviewRecord | null>;
  create: (input: ReviewInput) => Promise<ReviewRecord>;
  update: (reviewId: string, input: ReviewInput) => Promise<ReviewRecord>;
  validate: ReturnType<typeof createReviewResourceService>["validate"];
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

export const createReviewService = (dependencies: ReviewServiceDependencies = createReviewServiceDependencies()) => {
  const { repository, logger } = dependencies;
  const resource = createReviewResourceService(repository, logger);

  return {
    repository,
    resource,
    list: async () => (await repository.list()).items,
    getById: (reviewId: string) => repository.getById(reviewId),
    create: (input: ReviewInput) => resource.create(input, input.reviewerId),
    update: (reviewId: string, input: ReviewInput) => resource.update(reviewId, input, input.reviewerId),
    validate: resource.validate,
  } satisfies ReviewService;
};

const reviewService = createReviewService();

export const listReviews = async () => {
  return reviewService.list();
};

export const getReviewById = async (reviewId: string) => {
  return reviewService.getById(reviewId);
};

export const createReview = async (input: ReviewInput) => {
  return reviewService.create(input);
};

export const updateReview = async (reviewId: string, input: ReviewInput) => {
  return reviewService.update(reviewId, input);
};

export const isReviewValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
