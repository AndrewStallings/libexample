import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { toReviewInput } from "@/features/reviews/reviewDemoService";
import { getReviewById } from "@/features/reviews/reviewDemoService";

describe("ReviewForm", () => {
  it("submits valid values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ReviewForm mode="create" initialValue={toReviewInput()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Release gate summary" } });
    fireEvent.change(screen.getByLabelText("Reviewer"), { target: { value: "u-02" } });
    fireEvent.change(screen.getByLabelText("Review Type"), { target: { value: "rt-02" } });
    fireEvent.change(screen.getByLabelText("Rating"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Compliance review for release gate materials." } });
    fireEvent.click(screen.getByRole("button", { name: "Create review" }));

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

    render(<ReviewForm mode="create" initialValue={toReviewInput()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Approval request" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "approved" } });
    fireEvent.change(screen.getByLabelText("Rating"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Approval request for review board." } });
    fireEvent.click(screen.getByRole("button", { name: "Create review" }));

    await waitFor(() => {
      expect(screen.getByText("Approved reviews should have a rating of at least 3.")).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders edit metadata", () => {
    const record = getReviewById("RV-2001");
    render(<ReviewForm mode="edit" initialValue={toReviewInput(record)} record={record} onSubmit={vi.fn()} />);

    expect(screen.getByText("Edit Review")).toBeInTheDocument();
    expect(screen.getByText("ID: RV-2001")).toBeInTheDocument();
  });
});
