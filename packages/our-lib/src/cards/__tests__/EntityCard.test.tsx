import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EntityCard } from "../EntityCard";

describe("EntityCard", () => {
  it("renders sections and right-side actions", () => {
    render(
      <EntityCard
        sections={[
          {
            title: "Primary",
            items: [
              { value: "Example Record", label: "ID BK-1001", prominent: true },
              { value: "Morgan Lee", label: "Owner" },
            ],
          },
          {
            title: "Supporting",
            items: [
              { value: "Reusable card example", label: "Notes" },
              { value: "Today", label: "Updated" },
            ],
          },
        ]}
        actions={<button type="button">Edit</button>}
      />,
    );

    expect(screen.getByText("Example Record")).toBeInTheDocument();
    expect(screen.getByText("Morgan Lee")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
