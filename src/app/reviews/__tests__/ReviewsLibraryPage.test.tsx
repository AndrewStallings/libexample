import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewsLibraryPage } from "@/reviews/components/ReviewsLibraryPage";
import { renderWithAppProviders } from "@/testing/renderWithAppProviders";

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
  it("renders review cards and actions", async () => {
    renderWithAppProviders(<ReviewsLibraryPage />);

    expect(screen.getByText("Reviews pressure-test the pattern against joined lookup data.")).toBeInTheDocument();
    expect(await screen.findByText("Homepage launch checklist")).toBeInTheDocument();
    expect(await screen.findByText("Retention notice wording")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Form" })).toHaveLength(2);
    expect(await screen.findAllByRole("button", { name: "View Audit" })).toHaveLength(2);
  });
});
