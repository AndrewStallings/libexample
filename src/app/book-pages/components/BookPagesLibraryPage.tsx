"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { listBookPagesByBookIdAction } from "@/book-pages/actions";
import { BookPageFormPage } from "@/book-pages/components/BookPageFormPage";
import type { BookPageRecord } from "@/book-pages/models/schemas";
import type { BookRecord } from "@/books/models/schemas";

export const BOOK_PAGES_QUERY_KEY = "book-pages";
export const getBookPagesQueryKey = (bookId: string) => [BOOK_PAGES_QUERY_KEY, bookId] as const;

type BookPagesLibraryPageProps = {
  book: BookRecord;
  initialPageRecords: BookPageRecord[];
};

export const BookPagesLibraryPage = ({ book, initialPageRecords }: BookPagesLibraryPageProps) => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BookPageRecord | undefined>();
  const { data: pageRecords = [] } = useQuery({
    queryKey: getBookPagesQueryKey(book.bookId),
    queryFn: async () => listBookPagesByBookIdAction(book.bookId),
    initialData: initialPageRecords,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <Link className="app-back-link" href="/books">
          Back to books
        </Link>
        <p className="app-kicker" style={{ marginTop: "1.25rem" }}>
          Child Records Stress Test
        </p>
        <h1 className="app-title">{book.title} Pages</h1>
        <p className="app-copy">
          Each page card shows 15 data points to pressure-test the viewing abstraction with a denser child-record surface.
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
            Create Page
          </button>
        </div>
      </section>

      <section className="app-card-stack">
        {pageRecords.map((record) => (
          <EntityCard
            key={record.pageId}
            sections={[
              {
                title: "Identity",
                items: [
                  { value: record.pageTitle, label: `Page - ${record.pageId}`, prominent: true },
                  { value: String(record.pageNumber), label: "Page Number" },
                  { value: record.chapterTitle, label: "Chapter" },
                ],
              },
              {
                title: "Structure",
                items: [
                  { value: record.sectionName, label: "Section" },
                  { value: record.status, label: "Status" },
                  { value: record.audience, label: "Audience" },
                ],
              },
              {
                title: "People",
                items: [
                  { value: record.editorName, label: "Editor" },
                  { value: record.reviewerName, label: "Reviewer" },
                  { value: record.updatedBy, label: "Updated By" },
                ],
              },
              {
                title: "Metrics",
                items: [
                  { value: String(record.wordCount), label: "Word Count" },
                  { value: `${record.readingTimeMinutes} min`, label: "Reading Time" },
                  { value: String(record.illustrationCount), label: "Illustrations" },
                ],
              },
              {
                title: "Delivery",
                items: [
                  { value: String(record.componentCount), label: "Components" },
                  { value: record.locale, label: "Locale" },
                  { value: record.seoTitle, label: "SEO Title" },
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
                  Open Page
                </button>
                <CardActionButton>Preview Content</CardActionButton>
                <CardActionButton>Open Revision Trail</CardActionButton>
              </>
            }
          />
        ))}
      </section>

      <BookPageFormPage book={book} isOpen={panelMode !== null} mode={panelMode ?? "create"} onClose={closePanel} pageRecord={selectedRecord} />
    </main>
  );
};
