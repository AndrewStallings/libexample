import { z } from "zod";
import { createRecordResource, type AuditLogger } from "our-lib";
import type { BookRepository } from "@/books/data/bookRepository";
import { bookInputSchema, type BookInput, type BookRecord } from "@/books/models/schemas";

export const createBookService = (
  repository: BookRepository,
  logger: AuditLogger,
) => {
  const resource = createRecordResource({
    entityName: "book",
    repository,
    logger,
    route: "/books",
    source: "bookService",
    getEntityId: (record) => record.bookId,
  });

  return {
    list: resource.list,
    getById: resource.getById,
    create: async (input: BookInput, userId: string) => {
      const validated = bookInputSchema.parse(input);
      return resource.create(validated, userId);
    },
    update: async (id: string, input: BookInput, userId: string) => {
      const validated = bookInputSchema.parse(input);
      return resource.update(id, validated, userId);
    },
    validate: (input: BookInput) => {
      return bookInputSchema.safeParse(input);
    },
  };
};

export const isValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
