import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { SampleRecordFormPage } from "@/app/sample-records/components/SampleRecordFormPage";
import { resetSampleRecordService } from "@/app/sample-records/services/sampleRecordService";
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

describe("SampleRecordFormPage", () => {
  beforeEach(() => {
    resetSampleRecordService();
  });

  it("submits the sample record form", async () => {
    renderWithAppProviders(<SampleRecordFormPage mode="create" />);

    fillFormFields({
      Title: "Escalation Queue",
      Group: "Operations",
      Owner: "Jamie Hall",
      Notes: "Active routing note for the example sample record.",
    });

    clickButton("Create record");

    await waitFor(() => {
      expect(screen.getByText(/Created SR-/)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Back to sample records" })).toHaveAttribute("href", "/sample-records");
  });
});
