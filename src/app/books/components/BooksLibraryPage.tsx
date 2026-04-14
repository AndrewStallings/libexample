"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { BookFormPage } from "@/books/components/BookFormPage";
import type { BookRecord } from "@/books/models/schemas";
import { createBookService } from "@/books/services/bookService";

export const BOOKS_QUERY_KEY = "books";

const formatStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1);
};

export const BooksLibraryPage = () => {
  const service = useMemo(() => createBookService(), []);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BookRecord | undefined>();
  const { data: books = [] } = useQuery({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: async () => (await service.repository.list()).items,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">
          Viewing Experience
        </p>
        <h1 className="app-title">Cards own the page. Editing slides in beside them.</h1>
        <p className="app-copy">
          The book list stays card-first and full-width, while create and edit now happen in a side panel that refreshes the collection when you
          come back to the tab.
        </p>
        <div className="app-actions">
          <button
            className="app-primary-button"
            onClick={() => {
              setSelectedRecord(undefined);
              setPanelMode("create");
            }}
            type="button"
          >
            Create Book
          </button>
        </div>
      </section>

      <section className="app-card-stack">
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
