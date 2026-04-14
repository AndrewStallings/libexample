import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SampleRecordsLibraryPage } from "@/app/sample-records/components/SampleRecordsLibraryPage";
import { renderWithAppProviders } from "@/testing/renderWithAppProviders";

describe("SampleRecordsLibraryPage", () => {
  it("renders entity cards from the sample table", async () => {
    renderWithAppProviders(<SampleRecordsLibraryPage />);

    expect(screen.getByText("One table, one service, and a direct card layout.")).toBeInTheDocument();
    expect(await screen.findByText("Primary Campaign")).toBeInTheDocument();
    expect(await screen.findByText("Fallback Queue")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Record" })).toHaveLength(2);
  });
});
