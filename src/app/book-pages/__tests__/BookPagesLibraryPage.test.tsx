import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookPagesLibraryPage } from "@/book-pages/components/BookPagesLibraryPage";
import { getBookById } from "@/books/services/bookDemoService";

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
  it("renders dense child-record cards and page links", () => {
    const book = getBookById("BK-1001");
    if (!book) {
      throw new Error("Expected test book to exist.");
    }

    render(<BookPagesLibraryPage book={book} />);

    expect(screen.getByText("API Standards Handbook Pages")).toBeInTheDocument();
    expect(screen.getByText("Authentication Overview")).toBeInTheDocument();
    expect(screen.getByText("Page - PG-4002")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open Page" })).toHaveLength(2);
  });
});
