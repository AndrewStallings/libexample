import React from "react";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SampleRecordsLibraryPage } from "@/app/sample-records/components/SampleRecordsLibraryPage";
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

describe("SampleRecordsLibraryPage", () => {
  beforeEach(() => {
    resetSampleRecordService();
  });

  it("renders entity cards from the sample table", async () => {
    renderWithAppProviders(<SampleRecordsLibraryPage />);

    expect(screen.getByText("One table, one service, and a direct card layout.")).toBeInTheDocument();
    expect(await screen.findByText("Primary Campaign")).toBeInTheDocument();
    expect(await screen.findByText("Fallback Queue")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create Record" })).toHaveAttribute("href", "/sample-records/new");
    expect(await screen.findAllByRole("link", { name: "Open Record" })).toHaveLength(2);
  });
});
