import Link from "next/link";
import { EntityCard } from "our-lib";
import { initialBooks } from "@/features/books/bookRepository";

const formatStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1);
};

export const BooksLibraryPage = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Viewing Experience</p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Cards own the page. Forms live on dedicated routes.</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          This matches the workflow you described more closely: the record list is card-first, full-width, and easy to scan, while edits happen on
          a separate page such as <code>/books/BK-1001</code>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            href="/books/new"
          >
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
                  { value: record.title, label: `Title • ${record.bookId}`, prominent: true },
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
                <Link
                  className="rounded-xl border border-[color:rgba(31,41,55,0.14)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
                  href={`/books/${record.bookId}`}
                >
                  Open Form
                </Link>
                <button
                  className="rounded-xl border border-[color:rgba(31,41,55,0.14)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
                  type="button"
                >
                  Open History
                </button>
                {record.status !== "published" ? (
                  <button
                    className="rounded-xl border border-[color:rgba(31,41,55,0.14)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
                    type="button"
                  >
                    Request Review
                  </button>
                ) : null}
              </>
            }
          />
        ))}
      </section>
    </main>
  );
};
