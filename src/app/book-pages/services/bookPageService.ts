import { createRecordResource, InMemoryAuditLogger } from "our-lib";
import { bookPageInputSchema, type BookPageInput } from "@/book-pages/models/schemas";
import type { BookPageRepository } from "@/book-pages/data/bookPageRepository";

export const createBookPageService = (repository: BookPageRepository, logger = new InMemoryAuditLogger()) => {
  const resource = createRecordResource({
    entityName: "bookPage",
    repository,
    logger,
    route: "/book-pages",
    source: "bookPageService",
    getEntityId: (record) => record.pageId,
  });

  return {
    list: resource.list,
    listByBookId: (bookId: string) => repository.listByBookId(bookId),
    getById: resource.getById,
    create: async (input: BookPageInput, userId: string) => {
      return resource.create(bookPageInputSchema.parse(input), userId);
    },
    update: async (id: string, input: BookPageInput, userId: string) => {
      return resource.update(id, bookPageInputSchema.parse(input), userId);
    },
  };
};
