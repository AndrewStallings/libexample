import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BooksLibraryPage } from "@/books/components/BooksLibraryPage";
import { listBooks } from "@/books/services/bookService";
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

describe("BooksLibraryPage", () => {
  it("renders cards with record details and actions", async () => {
    renderWithAppProviders(<BooksLibraryPage initialBooks={await listBooks()} />);

    expect(screen.getByText("Cards own the page. Editing slides in beside them.")).toBeInTheDocument();
    expect(await screen.findByText("API Standards Handbook")).toBeInTheDocument();
    expect(await screen.findByText("Migration Runbook")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Form" })).toHaveLength(2);
    expect(await screen.findAllByRole("link", { name: "Open Pages" })).toHaveLength(2);
    expect(await screen.findAllByRole("button", { name: "Open History" })).toHaveLength(2);
  });

  it("renders the create book call to action", () => {
    renderWithAppProviders(<BooksLibraryPage initialBooks={[]} />);

    expect(screen.getByRole("button", { name: "Create Book" })).toBeInTheDocument();
  });

  it("shows request review only for non-published books", async () => {
    renderWithAppProviders(<BooksLibraryPage initialBooks={await listBooks()} />);

    expect(await screen.findAllByRole("button", { name: "Request Review" })).toHaveLength(1);
  });
});

