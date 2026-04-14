import { z } from "zod";
import { createWorkflowService, type AuditLogger } from "our-lib";
import { bookInputSchema, type BookInput, type BookRecord } from "@/books/models/schemas";
import { InMemoryBookRepository, type BookRepository, initialBooks } from "@/books/data/bookRepository";

const repository: BookRepository = new InMemoryBookRepository();

export type BookService = {
  repository: BookRepository;
};

export const createBookService = () => {
  return {
    repository,
  } satisfies BookService;
};

export const createBookResourceService = (repository: BookRepository, logger: AuditLogger) => {
  return createWorkflowService({
    entityName: "book",
    repository,
    logger,
    route: "/books",
    source: "bookService",
    getEntityId: (record) => record.bookId,
    inputSchema: bookInputSchema,
  });
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

export const isValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
