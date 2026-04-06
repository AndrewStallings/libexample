import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger, createInMemoryRecordRepository } from "our-lib";
import { initialBooks } from "@/books/data/bookRepository";
import type { BookInput, BookRecord } from "@/books/models/schemas";
import { createBookService } from "@/books/services/bookService";
import { createBookInput } from "@/testing/fixtures/books";

const createBookRepository = () => {
  return createInMemoryRecordRepository<BookRecord, BookInput, BookInput>({
    initialItems: initialBooks,
    getId: (record) => record.bookId,
    createRecord: (input, currentItems) => {
      return {
        bookId: `BK-${1000 + currentItems.length + 1}`,
        ...input,
        updatedAt: new Date().toISOString(),
        updatedBy: input.ownerName,
      };
    },
    updateRecord: (existing, input) => {
      return {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
        updatedBy: input.ownerName,
      };
    },
  });
};

describe("createBookService", () => {
  it("creates a book and writes an audit log without touching a database", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookService(repository, logger);

    const created = await service.create(
      createBookInput({
        title: "Unit Testing Guide",
        status: "published",
        ownerId: "u-03",
        ownerName: "Jamie Patel",
        notes: "Published guide for local unit testing.",
      }),
      "unit-test-user",
    );

    expect(created.bookId).toBeTruthy();
    expect(logger.entries).toHaveLength(1);
    expect(logger.entries[0]?.shortNote).toBe("book created");
    expect(logger.entries[0]?.userId).toBe("unit-test-user");
  });

  it("rejects invalid archived notes through zod validation", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookService(repository, logger);

    await expect(
      service.create(
        createBookInput({
          title: "Cleanup Plan",
          status: "archived",
          ownerId: "u-01",
          ownerName: "Alex Carter",
          notes: "Done",
        }),
        "unit-test-user",
      ),
    ).rejects.toThrowError();
  });
});

