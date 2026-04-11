"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BookPageForm } from "@/book-pages/components/BookPageForm";
import { createBookPageDemoService, toBookPageInput } from "@/book-pages/services/bookPageDemoService";
import type { BookPageRecord } from "@/book-pages/models/schemas";
import type { BookRecord } from "@/books/models/schemas";
import { SidePanelShell } from "@/app/components/SidePanelShell";
import { queryKeys } from "@/config/queryKeys";

type BookPageFormPageProps = {
  mode: "create" | "edit";
  book: BookRecord;
  pageRecord?: BookPageRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const BookPageFormPage = ({ mode, book, pageRecord, isOpen = true, onClose }: BookPageFormPageProps) => {
  const queryClient = useQueryClient();
  const service = createBookPageDemoService();
  const [currentRecord, setCurrentRecord] = useState<BookPageRecord | undefined>(pageRecord);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentRecord(pageRecord);
    setStatusMessage(null);
  }, [isOpen, mode, pageRecord]);

  return (
    <SidePanelShell
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
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.pageId} for ${book.title}.`);
            await queryClient.invalidateQueries({ queryKey: queryKeys.bookPages(book.bookId) });
            onClose?.();
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No page record was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.pageId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.pageId}.`);
          await queryClient.invalidateQueries({ queryKey: queryKeys.bookPages(book.bookId) });
          onClose?.();
        }}
      />
    </SidePanelShell>
  );
};
