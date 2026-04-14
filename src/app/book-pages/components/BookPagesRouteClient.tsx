"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BookPagesLibraryPage } from "@/book-pages/components/BookPagesLibraryPage";
import { BOOKS_QUERY_KEY } from "@/books/components/BooksLibraryPage";
import { createBookService } from "@/books/services/bookService";

type BookPagesRouteClientProps = {
  bookId: string;
};

export const BookPagesRouteClient = ({ bookId }: BookPagesRouteClientProps) => {
  const service = useMemo(() => createBookService(), []);
  const { data: books = [] } = useQuery({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: async () => (await service.repository.list()).items,
  });
  const book = books.find((record) => record.bookId === bookId);

  if (!book) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10 md:px-8">
        <Link className="text-sm font-semibold transition hover:opacity-80" href="/books">
          Back to books
        </Link>
        <div className="rounded-3xl border border-stone-200 bg-white/80 p-8">
          <h1 className="text-3xl font-semibold text-stone-900">Book not found</h1>
          <p className="mt-3 text-base text-stone-600">That book is no longer available in the current demo session.</p>
        </div>
      </main>
    );
  }

  return <BookPagesLibraryPage book={book} />;
};
