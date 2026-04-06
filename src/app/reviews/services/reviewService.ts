import { z } from "zod";
import { createRecordResource, type AuditLogger, type RecordRepository } from "our-lib";
import { reviewInputSchema, type ReviewInput, type ReviewRecord } from "@/reviews/models/schemas";

export const createReviewService = (
  repository: RecordRepository<ReviewRecord, ReviewInput, ReviewInput>,
  logger: AuditLogger,
) => {
  const resource = createRecordResource({
    entityName: "review",
    repository,
    logger,
    route: "/reviews",
    source: "reviewService",
    getEntityId: (record) => record.reviewId,
  });

  return {
    list: resource.list,
    getById: resource.getById,
    create: async (input: ReviewInput, userId: string) => {
      const validated = reviewInputSchema.parse(input);
      return resource.create(validated, userId);
    },
    update: async (id: string, input: ReviewInput, userId: string) => {
      const validated = reviewInputSchema.parse(input);
      return resource.update(id, validated, userId);
    },
    validate: (input: ReviewInput) => {
      return reviewInputSchema.safeParse(input);
    },
  };
};

export const isReviewValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
