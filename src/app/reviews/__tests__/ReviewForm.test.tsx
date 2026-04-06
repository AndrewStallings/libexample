import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { ReviewForm } from "@/reviews/components/ReviewForm";
import { createReviewInput, createReviewRecord } from "@/testing/fixtures/reviews";

describe("ReviewForm", () => {
  it("submits valid values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ReviewForm mode="create" initialValue={createReviewInput()} onSubmit={onSubmit} />);

    fillFormFields({
      Subject: "Release gate summary",
      Reviewer: "u-02",
      "Review Type": "rt-02",
      Rating: 4,
      Summary: "Compliance review for release gate materials.",
    });
    clickButton("Create review");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        subject: "Release gate summary",
        reviewerId: "u-02",
        reviewTypeId: "rt-02",
        rating: 4,
        status: "open",
        summary: "Compliance review for release gate materials.",
      });
    });
  });

  it("shows validation feedback when approved reviews are rated too low", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ReviewForm mode="create" initialValue={createReviewInput()} onSubmit={onSubmit} />);

    fillFormFields({
      Subject: "Approval request",
      Status: "approved",
      Rating: 2,
      Summary: "Approval request for review board.",
    });
    clickButton("Create review");

    await waitFor(() => {
      expect(screen.getByText("Approved reviews should have a rating of at least 3.")).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders edit metadata", () => {
    const record = createReviewRecord();
    render(<ReviewForm mode="edit" initialValue={createReviewInput(record)} record={record} onSubmit={vi.fn()} />);

    expect(screen.getByText("Edit Review")).toBeInTheDocument();
    expect(screen.getByText("ID: RV-2001")).toBeInTheDocument();
  });
});
