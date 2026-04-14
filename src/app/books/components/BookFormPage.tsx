"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FormShell, useSidePanelFormState } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { BOOKS_QUERY_KEY } from "@/books/components/BooksLibraryPage";
import { createBookService, toBookInput } from "@/books/services/bookService";
import type { BookRecord } from "@/books/models/schemas";

type BookFormPageProps = {
  mode: "create" | "edit";
  record?: BookRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const BookFormPage = ({ mode, record, isOpen = true, onClose }: BookFormPageProps) => {
  const service = useMemo(() => createBookService(), []);
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<ReturnType<typeof createBookService>, BookRecord, ReturnType<typeof toBookInput>>({
    mode,
    record,
    isOpen,
    onClose,
    createService: () => service,
    queryKey: [BOOKS_QUERY_KEY],
    createRecord: (serviceValue, input) => serviceValue.repository.create(input),
    updateRecord: (serviceValue, currentRecordValue, input) => serviceValue.repository.update(currentRecordValue.bookId, input),
    getRecordId: (currentRecordValue) => currentRecordValue.bookId,
  });

  return (
    <FormShell
      variant="side-panel"
      description="Books now edit in a side panel so the card view stays visible while we save and refresh the collection behind it."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={mode === "create" ? "Create a new book record" : `Edit ${currentRecord?.title ?? "book record"}`}
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
        onSubmit={handleSubmit}
      />
    </FormShell>
  );
};
