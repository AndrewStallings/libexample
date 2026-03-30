import { z } from "zod";
import { createCrudResource, type AuditLogger, type CrudRepository } from "our-lib";
import { bookInputSchema, type BookInput, type BookRecord } from "@/features/books/bookSchemas";

export const createBookService = (
  repository: CrudRepository<BookRecord, BookInput, BookInput>,
  logger: AuditLogger,
 ) => {
  const resource = createCrudResource({
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
