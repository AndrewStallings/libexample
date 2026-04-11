import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookPagesLibraryPage } from "@/book-pages/components/BookPagesLibraryPage";
import { getBookById } from "@/books/services/bookDemoService";
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

describe("BookPagesLibraryPage", () => {
  it("renders dense child-record cards and page links", async () => {
    const book = getBookById("BK-1001");
    if (!book) {
      throw new Error("Expected test book to exist.");
    }

    renderWithAppProviders(<BookPagesLibraryPage book={book} />);

    expect(screen.getByText("API Standards Handbook Pages")).toBeInTheDocument();
    expect(await screen.findByText("Authentication Overview")).toBeInTheDocument();
    expect(await screen.findByText("Page - PG-4002")).toBeInTheDocument();
    expect(await screen.findAllByRole("button", { name: "Open Page" })).toHaveLength(2);
  });
});
