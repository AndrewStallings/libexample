"use server";

import type { ReviewInput } from "@/reviews/models/schemas";
import { createReview, listReviews, updateReview } from "@/reviews/services/reviewService";

export const listReviewsAction = async () => {
  return listReviews();
};

export const createReviewAction = async (input: ReviewInput) => {
  return createReview(input);
};

export const updateReviewAction = async (reviewId: string, input: ReviewInput) => {
  return updateReview(reviewId, input);
};
