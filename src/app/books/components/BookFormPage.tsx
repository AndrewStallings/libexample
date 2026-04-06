"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormPageShell } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { createBookDemoService, toBookInput } from "@/books/services/bookDemoService";
import type { BookRecord } from "@/books/models/schemas";

type BookFormPageProps = {
  mode: "create" | "edit";
  record?: BookRecord;
};

export const BookFormPage = ({ mode, record }: BookFormPageProps) => {
  const service = useMemo(() => createBookDemoService(), []);
  const [currentRecord, setCurrentRecord] = useState<BookRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <FormPageShell
      backHref="/books"
      backLabel="Back to cards"
      title={mode === "create" ? "Create a new book record" : `Edit ${currentRecord?.title ?? "book record"}`}
      description="Forms live on their own route in this example so the viewing experience stays card-first and the edit experience can focus on one record."
      statusMessage={statusMessage}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
    >
      {currentRecord ? (
        <div className="flex justify-end">
          <Link className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-stone-50" href={`/book-pages/${currentRecord.bookId}`}>
            View Child Pages
          </Link>
        </div>
      ) : null}
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
    </FormPageShell>
  );
};
