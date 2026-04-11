import { InMemoryBookRepository, initialBooks } from "@/books/data/bookRepository";
import { createBookService } from "@/books/services/bookService";
import type { BookInput, BookRecord } from "@/books/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

const createBookDemoStore = () => {
  const repository = new InMemoryBookRepository();

  return {
    repository,
    service: createBookService(repository, createAppAuditLogger()),
  };
};

let bookDemoStore = createBookDemoStore();

export const createBookDemoService = () => {
  return bookDemoStore.service;
};

export const listBooks = async (): Promise<BookRecord[]> => {
  const result = await bookDemoStore.service.list();
  return result.items;
};

export const getBookRecordById = async (bookId: string): Promise<BookRecord | undefined> => {
  return (await bookDemoStore.service.getById(bookId)) ?? undefined;
};

export const resetBookDemoStore = () => {
  bookDemoStore = createBookDemoStore();
};

export const getBookById = (bookId: string): BookRecord | undefined => {
  return initialBooks.find((record) => record.bookId === bookId);
};

export const toBookInput = (record?: BookRecord): BookInput => {
  return {
    title: record?.title ?? "",
    status: record?.status ?? "draft",
    ownerId: record?.ownerId ?? "u-01",
    ownerName: record?.ownerName ?? "Alex Carter",
    notes: record?.notes ?? "",
  };
};
