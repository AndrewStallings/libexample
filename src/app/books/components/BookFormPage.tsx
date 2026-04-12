"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormShell } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { createBookDemoService, toBookInput } from "@/books/services/bookDemoService";
import type { BookRecord } from "@/books/models/schemas";
import { queryKeys } from "@/config/queryKeys";

type BookFormPageProps = {
  mode: "create" | "edit";
  record?: BookRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const BookFormPage = ({ mode, record, isOpen = true, onClose }: BookFormPageProps) => {
  const queryClient = useQueryClient();
  const service = createBookDemoService();
  const [currentRecord, setCurrentRecord] = useState<BookRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentRecord(record);
    setStatusMessage(null);
  }, [isOpen, mode, record]);

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
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.bookId}.`);
            await queryClient.invalidateQueries({ queryKey: queryKeys.books });
            onClose?.();
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No record was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.bookId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.bookId}.`);
          await queryClient.invalidateQueries({ queryKey: queryKeys.books });
          onClose?.();
        }}
      />
    </FormShell>
  );
};
