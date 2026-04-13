"use client";

import Link from "next/link";
import { FormShell, useSidePanelFormState } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { BOOKS_QUERY_KEY } from "@/books/components/BooksLibraryPage";
import { createBookDemoService, toBookInput } from "@/books/services/bookDemoService";
import type { BookRecord } from "@/books/models/schemas";

type BookFormPageProps = {
  mode: "create" | "edit";
  record?: BookRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const BookFormPage = ({ mode, record, isOpen = true, onClose }: BookFormPageProps) => {
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<ReturnType<typeof createBookDemoService>, BookRecord, ReturnType<typeof toBookInput>>({
    mode,
    record,
    isOpen,
    onClose,
    createService: createBookDemoService,
    queryKey: [BOOKS_QUERY_KEY],
    createRecord: (service, input) => service.create(input, "demo-user"),
    updateRecord: (service, currentRecordValue, input) => service.update(currentRecordValue.bookId, input, "demo-user"),
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
