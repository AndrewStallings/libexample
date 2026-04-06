import type { EntityId, ListResult, RecordRepository } from "our-lib";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import type { ReviewInput, ReviewRecord } from "@/reviews/models/schemas";

type ReviewRow = {
  reviewId: string;
  subject: string;
  reviewerId: string;
  reviewTypeId: string;
  rating: number;
  status: ReviewInput["status"];
  summary: string;
  updatedAt: string;
};

const toReviewRecord = (row: ReviewRow): ReviewRecord => {
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

export const initialReviewRows: ReviewRow[] = [
  {
    reviewId: "RV-2001",
    subject: "Homepage launch checklist",
    reviewerId: "u-01",
    reviewTypeId: "rt-03",
    rating: 4,
    status: "approved",
    summary: "Release gate review for the homepage launch workflow.",
    updatedAt: "2026-03-27T14:00:00.000Z",
  },
  {
    reviewId: "RV-2002",
    subject: "Retention notice wording",
    reviewerId: "u-02",
    reviewTypeId: "rt-02",
    rating: 2,
    status: "open",
    summary: "Compliance review for updated retention language and disclosures.",
    updatedAt: "2026-03-29T09:45:00.000Z",
  },
];

export class InMemoryReviewRepository implements RecordRepository<ReviewRecord, ReviewInput, ReviewInput> {
  private items = [...initialReviewRows];

  list = async (): Promise<ListResult<ReviewRecord>> => {
    return {
      items: this.items.map(toReviewRecord),
      total: this.items.length,
    };
  };

  getById = async (id: EntityId): Promise<ReviewRecord | null> => {
    const row = this.items.find((item) => item.reviewId === id);
    return row ? toReviewRecord(row) : null;
  };

  create = async (input: ReviewInput): Promise<ReviewRecord> => {
    const row: ReviewRow = {
      reviewId: `RV-${2000 + this.items.length + 1}`,
      subject: input.subject,
      reviewerId: input.reviewerId,
      reviewTypeId: input.reviewTypeId,
      rating: input.rating,
      status: input.status,
      summary: input.summary,
      updatedAt: new Date().toISOString(),
    };

    this.items.unshift(row);
    return toReviewRecord(row);
  };

  update = async (id: EntityId, input: ReviewInput): Promise<ReviewRecord> => {
    const index = this.items.findIndex((item) => item.reviewId === id);

    if (index < 0) {
      throw new Error(`Review ${id} was not found`);
    }

    const updatedRow: ReviewRow = {
      reviewId: this.items[index].reviewId,
      subject: input.subject,
      reviewerId: input.reviewerId,
      reviewTypeId: input.reviewTypeId,
      rating: input.rating,
      status: input.status,
      summary: input.summary,
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedRow;
    return toReviewRecord(updatedRow);
  };
}
