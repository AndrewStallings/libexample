import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SalesTrackerPage } from "@/sales/components/SalesTrackerPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("SalesTrackerPage", () => {
  it("renders the dual-view sales tracker", async () => {
    render(<SalesTrackerPage />);

    expect(await screen.findByText("Sales tracker with shared dataset, dual card views, and local transformations.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
  });

  it("shows grouped reviewer cards and a selectable sale list when switched to reviewer view", async () => {
    render(<SalesTrackerPage />);

    fireEvent.click(await screen.findByRole("button", { name: /Switch to Sales by Reviewer/i }));
    fireEvent.click(screen.getAllByText("Open Form")[0]);

    expect(screen.getByText("4 records")).toBeInTheDocument();
    expect(screen.getByText("SL-3001 - API Standards Handbook")).toBeInTheDocument();
  });
});
