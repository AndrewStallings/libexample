import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SnacksLibraryPage } from "@/snacks/components/SnacksLibraryPage";
import { listSnacks } from "@/snacks/services/snackService";
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

describe("SnacksLibraryPage", () => {
  it("renders generated snack cards and form links", async () => {
    renderWithAppProviders(<SnacksLibraryPage initialSnacks={await listSnacks()} />);

    expect(screen.getByText("Snacks are driven by a single reusable resource definition.")).toBeInTheDocument();
    expect(await screen.findByText("Sea Salt Popcorn")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Form" })).toHaveLength(2);
  });
});
