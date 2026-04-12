"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { BookFormPage } from "@/books/components/BookFormPage";
import type { BookRecord } from "@/books/models/schemas";
import { listBooks } from "@/books/services/bookDemoService";

export const BOOKS_QUERY_KEY = "books";

const formatStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1);
};

export const BooksLibraryPage = () => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BookRecord | undefined>();
  const { data: books = [] } = useQuery({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: listBooks,
  });

  const createButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Viewing Experience
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Cards own the page. Editing slides in beside them.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          The book list stays card-first and full-width, while create and edit now happen in a side panel that refreshes the collection when you
          come back to the tab.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={() => {
              setSelectedRecord(undefined);
              setPanelMode("create");
            }}
            style={createButtonStyle}
            type="button"
          >
            Create Book
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {books.map((record) => (
          <EntityCard
            key={record.bookId}
            sections={[
              {
                title: "Primary",
                items: [
                  { value: record.title, label: `Title - ${record.bookId}`, prominent: true },
                  { value: record.ownerName, label: "Owner" },
                  { value: formatStatus(record.status), label: "Status" },
                ],
              },
              {
                title: "Supporting",
                items: [
                  { value: record.notes, label: "Notes" },
                  { value: record.updatedBy, label: "Last Modified By" },
                  { value: record.updatedAt, label: "Updated At" },
                ],
              },
            ]}
            actions={
              <>
                <button
                  className={cardActionClassName}
                  onClick={() => {
                    setSelectedRecord(record);
                    setPanelMode("edit");
                  }}
                  type="button"
                >
                  Open Form
                </button>
                <Link className={cardActionClassName} href={`/book-pages/${record.bookId}`}>
                  Open Pages
                </Link>
                <CardActionButton>Open History</CardActionButton>
                {record.status !== "published" ? <CardActionButton>Request Review</CardActionButton> : null}
              </>
            }
          />
        ))}
      </section>

      <BookFormPage isOpen={panelMode !== null} mode={panelMode ?? "create"} onClose={closePanel} record={selectedRecord} />
    </main>
  );
};
