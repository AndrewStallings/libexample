import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SnacksLibraryPage } from "@/snacks/components/SnacksLibraryPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("SnacksLibraryPage", () => {
  it("renders generated snack cards and form links", () => {
    render(<SnacksLibraryPage />);

    expect(screen.getByText("Snacks are driven by a single reusable resource definition.")).toBeInTheDocument();
    expect(screen.getByText("Sea Salt Popcorn")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open Form" })).toHaveLength(2);
  });
});
