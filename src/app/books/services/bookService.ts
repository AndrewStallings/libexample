import "server-only";

import { z } from "zod";
import { createWorkflowService, type AuditLogger } from "our-lib";
import { bookInputSchema, type BookInput } from "@/books/models/schemas";
import { InMemoryBookRepository, type BookRepository } from "@/books/data/bookRepository";
import { createAppAuditLogger } from "@/config/auditLogger";

type BookServiceDependencies = {
  repository: BookRepository;
  logger: AuditLogger;
};

const createBookServiceDependencies = (): BookServiceDependencies => {
  return {
    repository: new InMemoryBookRepository(),
    logger: createAppAuditLogger(),
  };
};

export type BookService = {
  repository: BookRepository;
  resource: ReturnType<typeof createBookResourceService>;
  list: () => Promise<Awaited<ReturnType<BookRepository["list"]>>["items"]>;
  getById: (bookId: string) => ReturnType<BookRepository["getById"]>;
  create: (input: BookInput) => Promise<Awaited<ReturnType<ReturnType<typeof createBookResourceService>["create"]>>>;
  update: (bookId: string, input: BookInput) => Promise<Awaited<ReturnType<ReturnType<typeof createBookResourceService>["update"]>>>;
  validate: ReturnType<typeof createBookResourceService>["validate"];
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

export const createBookService = (dependencies: BookServiceDependencies = createBookServiceDependencies()) => {
  const { repository, logger } = dependencies;
  const resource = createBookResourceService(repository, logger);

  return {
    repository,
    resource,
    list: async () => (await repository.list()).items,
    getById: (bookId: string) => repository.getById(bookId),
    create: (input: BookInput) => resource.create(input, input.ownerId),
    update: (bookId: string, input: BookInput) => resource.update(bookId, input, input.ownerId),
    validate: resource.validate,
  } satisfies BookService;
};

const bookService = createBookService();

export const listBooks = async () => {
  return bookService.list();
};

export const getBookById = async (bookId: string) => {
  return bookService.getById(bookId);
};

export const createBook = async (input: BookInput) => {
  return bookService.create(input);
};

export const updateBook = async (bookId: string, input: BookInput) => {
  return bookService.update(bookId, input);
};

export const isValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
