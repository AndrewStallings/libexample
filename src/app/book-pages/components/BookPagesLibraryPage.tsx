import Link from "next/link";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { getBookPagesByBookId } from "@/book-pages/services/bookPageDemoService";
import type { BookRecord } from "@/books/models/schemas";

type BookPagesLibraryPageProps = {
  book: BookRecord;
};

export const BookPagesLibraryPage = ({ book }: BookPagesLibraryPageProps) => {
  const pageRecords = getBookPagesByBookId(book.bookId);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-5xl">
        <Link className="text-sm font-semibold transition hover:opacity-80" href={`/books/${book.bookId}`}>
          Back to {book.title}
        </Link>
        <p className="mt-4 text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Child Records Stress Test
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{book.title} Pages</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          Each page card shows 15 data points to pressure-test the viewing abstraction with a denser child-record surface.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href={`/book-pages/${book.bookId}/new`}>
            Create Page
          </Link>
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
                <Link className={cardActionClassName} href={`/book-pages/${book.bookId}/${record.pageId}`}>
                  Open Page
                </Link>
                <CardActionButton>Preview Content</CardActionButton>
                <CardActionButton>Open Revision Trail</CardActionButton>
              </>
            }
          />
        ))}
      </section>
    </main>
  );
};
