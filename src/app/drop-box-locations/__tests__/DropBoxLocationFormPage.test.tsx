import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { DropBoxLocationFormPage } from "@/drop-box-locations/components/DropBoxLocationFormPage";

describe("DropBoxLocationFormPage", () => {
  it("submits a generated form layout", async () => {
    render(<DropBoxLocationFormPage mode="create" />);

    fillFormFields({
      "Location Name": "South Campus West Wing",
      Campus: "South Campus",
      Building: "West Wing",
      Zone: "B4",
      "Pickup Window": "09:00 - 11:00",
      Capacity: 220,
      "Current Load": 80,
      "Access Code": "SCW-90",
      "Climate Zone": "Indoor",
      Notes: "High-volume box near the west student commons.",
    });

    fireEvent.change(screen.getByPlaceholderText("Search district managers"), { target: { value: "Taylor" } });
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Taylor Brooks/i })).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByRole("option", { name: /Taylor Brooks/i }));

    clickButton("Create location");

    await waitFor(() => {
      expect(screen.getByText(/Created DB-/)).toBeInTheDocument();
    });
  });
});
