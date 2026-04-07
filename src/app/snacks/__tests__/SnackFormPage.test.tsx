import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { SnackFormPage } from "@/snacks/components/SnackFormPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("SnackFormPage", () => {
  it("submits the generated snack form", async () => {
    render(<SnackFormPage mode="create" />);

    fillFormFields({
      "Snack Name": "Chili Citrus Trail Mix",
      Category: "protein",
      "Shelf Location": "Center Endcap",
      "Price (Cents)": 525,
      "Stock Count": 14,
      Status: "seasonal",
      Notes: "Season launch mix for commuter traffic near the front register.",
    });

    fireEvent.change(screen.getByPlaceholderText("Search suppliers"), { target: { value: "Peak" } });
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Peak Protein Co./i })).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByRole("option", { name: /Peak Protein Co./i }));

    clickButton("Create snack");

    await waitFor(() => {
      expect(screen.getByText(/Created SN-/)).toBeInTheDocument();
    });
  });
});
