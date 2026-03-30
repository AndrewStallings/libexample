import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger, createInMemoryCrudRepository } from "our-lib";
import { createReviewService } from "@/features/reviews/reviewService";
import { initialReviewRows } from "@/features/reviews/reviewRepository";
import { reviewTypes, reviewerOptions } from "@/features/reviews/reviewLookupData";
import type { ReviewInput, ReviewRecord } from "@/features/reviews/reviewSchemas";

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

const createReviewRepository = () => {
  return createInMemoryCrudRepository<ReviewRecord, ReviewInput, ReviewInput>({
    initialItems: initialReviewRows.map(toReviewRecord),
    getId: (record) => record.reviewId,
    createRecord: (input, currentItems) => {
      const reviewType = reviewTypes.find((item) => item.reviewTypeId === input.reviewTypeId);
      const reviewer = reviewerOptions.find((item) => item.value === input.reviewerId);

      return {
        reviewId: `RV-${2000 + currentItems.length + 1}`,
        subject: input.subject,
        reviewerId: input.reviewerId,
        reviewerName: reviewer?.label ?? input.reviewerId,
        reviewTypeId: input.reviewTypeId,
        reviewTypeName: reviewType?.type ?? input.reviewTypeId,
        rating: input.rating,
        status: input.status,
        summary: input.summary,
        updatedAt: new Date().toISOString(),
      };
    },
    updateRecord: (existing, input) => {
      const reviewType = reviewTypes.find((item) => item.reviewTypeId === input.reviewTypeId);
      const reviewer = reviewerOptions.find((item) => item.value === input.reviewerId);

      return {
        ...existing,
        subject: input.subject,
        reviewerId: input.reviewerId,
        reviewerName: reviewer?.label ?? input.reviewerId,
        reviewTypeId: input.reviewTypeId,
        reviewTypeName: reviewType?.type ?? input.reviewTypeId,
        rating: input.rating,
        status: input.status,
        summary: input.summary,
        updatedAt: new Date().toISOString(),
      };
    },
  });
};

describe("createReviewService", () => {
  it("creates a review with lookup-enriched fields and writes an audit log", async () => {
    const repository = createReviewRepository();
    const logger = new InMemoryAuditLogger();
    const service = createReviewService(repository, logger);

    const created = await service.create(
      {
        subject: "Search release checklist",
        reviewerId: "u-03",
        reviewTypeId: "rt-01",
        rating: 4,
        status: "approved",
        summary: "Editorial review for the new search release plan.",
      },
      "review-test-user",
    );

    expect(created.reviewTypeName).toBe("Editorial");
    expect(created.reviewerName).toBe("Jamie Patel");
    expect(logger.entries[0]?.shortNote).toBe("review created");
  });

  it("rejects approved reviews with a low rating", async () => {
    const repository = createReviewRepository();
    const logger = new InMemoryAuditLogger();
    const service = createReviewService(repository, logger);

    await expect(
      service.create(
        {
          subject: "Launch decision",
          reviewerId: "u-01",
          reviewTypeId: "rt-03",
          rating: 2,
          status: "approved",
          summary: "Release review decision pending more evidence.",
        },
        "review-test-user",
      ),
    ).rejects.toThrowError();
  });
});
