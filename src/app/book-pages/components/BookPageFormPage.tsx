"use client";

import { FormShell, useSidePanelFormState } from "our-lib";
import { getBookPagesQueryKey } from "@/book-pages/components/BookPagesLibraryPage";
import { BookPageForm } from "@/book-pages/components/BookPageForm";
import { createBookPageDemoService, toBookPageInput } from "@/book-pages/services/bookPageDemoService";
import type { BookPageRecord } from "@/book-pages/models/schemas";
import type { BookRecord } from "@/books/models/schemas";

type BookPageFormPageProps = {
  mode: "create" | "edit";
  book: BookRecord;
  pageRecord?: BookPageRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const BookPageFormPage = ({ mode, book, pageRecord, isOpen = true, onClose }: BookPageFormPageProps) => {
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    ReturnType<typeof createBookPageDemoService>,
    BookPageRecord,
    ReturnType<typeof toBookPageInput>
  >({
    mode,
    record: pageRecord,
    isOpen,
    onClose,
    createService: createBookPageDemoService,
    queryKey: getBookPagesQueryKey(book.bookId),
    createRecord: (service, input) => service.create(input, "demo-user"),
    updateRecord: (service, currentRecordValue, input) => service.update(currentRecordValue.pageId, input, "demo-user"),
    getRecordId: (currentRecordValue) => currentRecordValue.pageId,
    entityLabel: "page record",
    getCreatedMessage: (created) => `Created ${created.pageId} for ${book.title}.`,
  });

  return (
    <FormShell
      variant="side-panel"
      description="Child page editing now stays in a side panel so the dense page card list remains in view."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={mode === "create" ? `Create a page for ${book.title}` : `Edit ${currentRecord?.pageTitle ?? "book page"}`}
    >
      <BookPageForm
        key={currentRecord?.pageId ?? `${book.bookId}-new-page`}
        initialValue={toBookPageInput(book.bookId, currentRecord)}
        mode={mode}
        record={currentRecord}
        onSubmit={handleSubmit}
      />
    </FormShell>
  );
};
