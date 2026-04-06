"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormPageShell } from "our-lib";
import { BookPageForm } from "@/book-pages/components/BookPageForm";
import { createBookPageDemoService, toBookPageInput } from "@/book-pages/services/bookPageDemoService";
import type { BookPageRecord } from "@/book-pages/models/schemas";
import type { BookRecord } from "@/books/models/schemas";

type BookPageFormPageProps = {
  mode: "create" | "edit";
  book: BookRecord;
  pageRecord?: BookPageRecord;
};

export const BookPageFormPage = ({ mode, book, pageRecord }: BookPageFormPageProps) => {
  const service = useMemo(() => createBookPageDemoService(), []);
  const [currentRecord, setCurrentRecord] = useState<BookPageRecord | undefined>(pageRecord);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <FormPageShell
      backHref={`/book-pages/${book.bookId}`}
      backLabel={`Back to ${book.title} pages`}
      title={mode === "create" ? `Create a page for ${book.title}` : `Edit ${currentRecord?.pageTitle ?? "book page"}`}
      description="This child record flow stress-tests a parent-to-many-pages relationship while keeping the editing experience route-based."
      statusMessage={statusMessage}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
    >
      <BookPageForm
        key={currentRecord?.pageId ?? `${book.bookId}-new-page`}
        initialValue={toBookPageInput(book.bookId, currentRecord)}
        mode={mode}
        record={currentRecord}
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.pageId} for ${book.title}.`);
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No page record was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.pageId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.pageId}.`);
        }}
      />
    </FormPageShell>
  );
};
