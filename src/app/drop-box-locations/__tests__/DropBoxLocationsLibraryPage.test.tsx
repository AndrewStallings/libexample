import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropBoxLocationsLibraryPage } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";
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

describe("DropBoxLocationsLibraryPage", () => {
  it("renders generated resource cards and form links", async () => {
    renderWithAppProviders(<DropBoxLocationsLibraryPage />);

    expect(screen.getByText("Drop box locations use a generated card and form layout.")).toBeInTheDocument();
    expect(await screen.findByText("North Campus Main Hall")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Form" })).toHaveLength(2);
  });
});
