"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { BookPageFormPage } from "@/book-pages/components/BookPageFormPage";
import { listBookPagesByBookId } from "@/book-pages/services/bookPageDemoService";
import type { BookPageRecord } from "@/book-pages/models/schemas";
import type { BookRecord } from "@/books/models/schemas";
import { queryKeys } from "@/config/queryKeys";

type BookPagesLibraryPageProps = {
  book: BookRecord;
};

export const BookPagesLibraryPage = ({ book }: BookPagesLibraryPageProps) => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BookPageRecord | undefined>();
  const { data: pageRecords = [] } = useQuery({
    queryKey: queryKeys.bookPages(book.bookId),
    queryFn: () => listBookPagesByBookId(book.bookId),
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-5xl">
        <Link className="text-sm font-semibold transition hover:opacity-80" href="/books">
          Back to books
        </Link>
        <p className="mt-4 text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Child Records Stress Test
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{book.title} Pages</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          Each page card shows 15 data points to pressure-test the viewing abstraction with a denser child-record surface.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
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

      <section className="space-y-6">
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
