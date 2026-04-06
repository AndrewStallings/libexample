import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropBoxLocationsLibraryPage } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("DropBoxLocationsLibraryPage", () => {
  it("renders generated resource cards and form links", () => {
    render(<DropBoxLocationsLibraryPage />);

    expect(screen.getByText("Drop box locations use a generated card and form layout.")).toBeInTheDocument();
    expect(screen.getByText("North Campus Main Hall")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open Form" })).toHaveLength(2);
  });
});
