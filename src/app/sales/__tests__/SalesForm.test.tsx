import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fillFormFields } from "our-lib";
import { SalesForm } from "@/sales/components/SalesForm";
import { createSaleInput } from "@/testing/fixtures/sales";

describe("SalesForm", () => {
  it("shows and hides store location based on sale type", () => {
    render(<SalesForm initialValue={createSaleInput({ quantity: 1, totalAmount: 10, saleDate: "2026-03-01", orderId: "" })} mode="create" onSubmit={vi.fn()} />);

    expect(screen.queryByLabelText("Store Location")).not.toBeInTheDocument();

    fillFormFields({ "Sale Type": "instore" });
    expect(screen.getByLabelText("Store Location")).toBeInTheDocument();

    fillFormFields({ "Sale Type": "online" });
    expect(screen.queryByLabelText("Store Location")).not.toBeInTheDocument();
  });
});
