import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BooksLibraryPage } from "@/books/components/BooksLibraryPage";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe("BooksLibraryPage", () => {
  it("renders cards with record details and actions", () => {
    render(<BooksLibraryPage />);

    expect(screen.getByText("Cards own the page. Forms live on dedicated routes.")).toBeInTheDocument();
    expect(screen.getByText("API Standards Handbook")).toBeInTheDocument();
    expect(screen.getByText("Migration Runbook")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open Form" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Open Pages" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Open History" })).toHaveLength(2);
  });

  it("renders the create book call to action", () => {
    render(<BooksLibraryPage />);

    expect(screen.getByRole("link", { name: "Create Book" })).toHaveAttribute("href", "/books/new");
  });

  it("shows request review only for non-published books", () => {
    render(<BooksLibraryPage />);

    expect(screen.getAllByRole("button", { name: "Request Review" })).toHaveLength(1);
  });
});

