import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger, createInMemoryRecordRepository } from "our-lib";
import { initialBooks } from "@/books/data/bookRepository";
import type { BookInput, BookRecord } from "@/books/models/schemas";
import { createBookResourceService, isValidationError } from "@/books/services/bookService";
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
    const service = createBookResourceService(repository, logger);

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
    const service = createBookResourceService(repository, logger);

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

  it("lists the seeded books", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    const result = await service.list();

    expect(result.total).toBe(initialBooks.length);
    expect(result.items.map((item) => item.bookId)).toEqual(initialBooks.map((item) => item.bookId));
  });

  it("returns a book by id", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    const record = await service.getById("BK-1001");

    expect(record?.title).toBe("API Standards Handbook");
    expect(record?.ownerName).toBe("Alex Carter");
  });

  it("updates a book and writes an audit log", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    const updated = await service.update(
      "BK-1001",
      createBookInput({
        title: "API Standards Handbook Revised",
        status: "published",
        ownerId: "u-02",
        ownerName: "Morgan Lee",
        notes: "Published revision for the standards archive process.",
      }),
      "update-user",
    );

    expect(updated.title).toBe("API Standards Handbook Revised");
    expect(updated.updatedBy).toBe("Morgan Lee");
    expect(logger.entries.at(-1)?.shortNote).toBe("book updated");
    expect(logger.entries.at(-1)?.userId).toBe("update-user");
  });

  it("validate returns a successful result for a good payload", () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    const result = service.validate(
      createBookInput({
        title: "Local Validation Notes",
        notes: "Archive readiness notes for validation coverage.",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("validate returns issues for a bad payload", () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    const result = service.validate(
      createBookInput({
        title: "",
        notes: "bad",
      }),
    );

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected validation to fail for the bad payload.");
    }

    expect(result.error.issues.length).toBeGreaterThan(0);
  });

  it("exposes zod errors through isValidationError", async () => {
    const repository = createBookRepository();
    const logger = new InMemoryAuditLogger();
    const service = createBookResourceService(repository, logger);

    try {
      await service.create(
        createBookInput({
          title: "A",
          notes: "bad",
        }),
        "validation-user",
      );
    } catch (error) {
      expect(isValidationError(error)).toBe(true);
      return;
    }

    throw new Error("Expected createBookService.create to throw a validation error.");
  });
});

