import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewsLibraryPage } from "@/features/reviews/ReviewsLibraryPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("ReviewsLibraryPage", () => {
  it("renders review cards and actions", () => {
    render(<ReviewsLibraryPage />);

    expect(screen.getByText("Reviews pressure-test the pattern against joined lookup data.")).toBeInTheDocument();
    expect(screen.getByText("Homepage launch checklist")).toBeInTheDocument();
    expect(screen.getByText("Retention notice wording")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open Form" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "View Audit" })).toHaveLength(2);
  });
});
