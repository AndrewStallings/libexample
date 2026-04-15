import "server-only";

import { createWorkflowService, type AuditLogger } from "our-lib";
import { InMemoryBookPageRepository, type BookPageRepository } from "@/book-pages/data/bookPageRepository";
import { bookPageInputSchema, type BookPageInput } from "@/book-pages/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

type BookPageServiceDependencies = {
  repository: BookPageRepository;
  logger: AuditLogger;
};

const createBookPageServiceDependencies = (): BookPageServiceDependencies => {
  return {
    repository: new InMemoryBookPageRepository(),
    logger: createAppAuditLogger(),
  };
};

export type BookPageService = {
  repository: BookPageRepository;
  resource: ReturnType<typeof createBookPageResourceService>;
  list: () => Promise<Awaited<ReturnType<BookPageRepository["list"]>>["items"]>;
  getById: (pageId: string) => ReturnType<BookPageRepository["getById"]>;
  getByBookId: (bookId: string) => Promise<Awaited<ReturnType<BookPageRepository["listByBookId"]>>["items"]>;
  create: (input: BookPageInput) => Promise<Awaited<ReturnType<ReturnType<typeof createBookPageResourceService>["create"]>>>;
  update: (pageId: string, input: BookPageInput) => Promise<Awaited<ReturnType<ReturnType<typeof createBookPageResourceService>["update"]>>>;
  validate: ReturnType<typeof createBookPageResourceService>["validate"];
};

export const createBookPageResourceService = (repository: BookPageRepository, logger: AuditLogger) => {
  return createWorkflowService({
    entityName: "bookPage",
    repository,
    logger,
    route: "/book-pages",
    source: "bookPageService",
    getEntityId: (record) => record.pageId,
    inputSchema: bookPageInputSchema,
  });
};

export const createBookPageService = (dependencies: BookPageServiceDependencies = createBookPageServiceDependencies()) => {
  const { repository, logger } = dependencies;
  const resource = createBookPageResourceService(repository, logger);

  return {
    repository,
    resource,
    list: async () => (await repository.list()).items,
    getById: (pageId: string) => repository.getById(pageId),
    getByBookId: async (bookId: string) => (await repository.listByBookId(bookId)).items,
    create: (input: BookPageInput) => resource.create(input, input.editorId),
    update: (pageId: string, input: BookPageInput) => resource.update(pageId, input, input.editorId),
    validate: resource.validate,
  } satisfies BookPageService;
};

const bookPageService = createBookPageService();

export const listBookPages = async () => {
  return bookPageService.list();
};

export const getBookPageById = async (pageId: string) => {
  return bookPageService.getById(pageId);
};

export const getBookPagesByBookId = async (bookId: string) => {
  return bookPageService.getByBookId(bookId);
};

export const createBookPage = async (input: BookPageInput) => {
  return bookPageService.create(input);
};

export const updateBookPage = async (pageId: string, input: BookPageInput) => {
  return bookPageService.update(pageId, input);
};
