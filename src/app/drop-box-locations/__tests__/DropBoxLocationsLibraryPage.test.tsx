import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropBoxLocationsLibraryPage } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";
import { listDropBoxLocations } from "@/drop-box-locations/services/dropBoxLocationService";
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
    renderWithAppProviders(<DropBoxLocationsLibraryPage initialLocations={await listDropBoxLocations()} />);

    expect(screen.getByText("Generated library primitives driving a real resource workflow.")).toBeInTheDocument();
    expect(await screen.findByText("North Campus Main Hall")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Form" })).toHaveLength(2);
  });
});
