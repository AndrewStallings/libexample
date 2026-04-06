import Link from "next/link";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { initialBooks } from "@/books/data/bookRepository";

const formatStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1);
};

export const BooksLibraryPage = () => {
  const createButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Viewing Experience
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Cards own the page. Forms live on dedicated routes.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          This matches the workflow you described more closely: the record list is card-first, full-width, and easy to scan, while edits happen on
          a separate page such as <code>/books/BK-1001</code>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href="/books/new" style={createButtonStyle}>
            Create Book
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        {initialBooks.map((record) => (
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
                <Link className={cardActionClassName} href={`/books/${record.bookId}`}>
                  Open Form
                </Link>
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
    </main>
  );
};
