import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormFrame } from "../FormFrame";

describe("FormFrame", () => {
  it("renders numeric ids and formats Date updatedAt values", () => {
    render(
      <FormFrame
        footer={<button type="button">Save</button>}
        recordId={42}
        title="Snack"
        updatedAt={new Date("2026-04-07T10:00:00.000Z")}
        updatedBy="Alex Carter"
      >
        <div>Field</div>
      </FormFrame>,
    );

    expect(screen.getByText("ID: 42")).toBeInTheDocument();
    expect(screen.getByText("2026-04-07T10:00:00.000Z")).toBeInTheDocument();
    expect(screen.getByText("Last modified by Alex Carter")).toBeInTheDocument();
  });

  it("renders ISO-capable updatedAt values through toISO", () => {
    render(
      <FormFrame
        footer={<button type="button">Save</button>}
        title="Snack"
        updatedAt={{ toISO: () => "2026-04-07T11:30:00.000Z" }}
      >
        <div>Field</div>
      </FormFrame>,
    );

    expect(screen.getByText("2026-04-07T11:30:00.000Z")).toBeInTheDocument();
  });
});
