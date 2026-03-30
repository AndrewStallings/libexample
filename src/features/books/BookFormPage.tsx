"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookForm } from "@/features/books/BookForm";
import { createBookDemoService, toBookInput } from "@/features/books/bookDemoService";
import type { BookRecord } from "@/features/books/bookSchemas";

type BookFormPageProps = {
  mode: "create" | "edit";
  record?: BookRecord;
};

export const BookFormPage = ({ mode, record }: BookFormPageProps) => {
  const service = useMemo(() => createBookDemoService(), []);
  const [currentRecord, setCurrentRecord] = useState<BookRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-3xl">
        <Link className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]" href="/books">
          Back to cards
        </Link>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">
          {mode === "create" ? "Create a new book record" : `Edit ${currentRecord?.title ?? "book record"}`}
        </h1>
        <p className="mt-3 text-base text-[var(--muted)]">
          Forms live on their own route in this example so the viewing experience stays card-first and the edit experience can focus on one record.
        </p>
        {statusMessage ? (
          <div className="mt-4 rounded-2xl border border-[color:rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] px-4 py-3 text-sm text-[var(--accent-strong)]">
            {statusMessage}
          </div>
        ) : null}
      </section>

      <BookForm
        key={currentRecord?.bookId ?? "new-record"}
        mode={mode}
        initialValue={toBookInput(currentRecord)}
        record={currentRecord}
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.bookId}. In a real app this would usually redirect back to the card view or stay on the detail route.`);
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No record was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.bookId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.bookId}.`);
        }}
      />
    </main>
  );
};
