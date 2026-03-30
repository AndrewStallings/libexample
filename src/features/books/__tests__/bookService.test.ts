import { describe, expect, it } from "vitest";
import { createCrudTestHarness } from "our-lib";
import { InMemoryBookRepository } from "@/features/books/bookRepository";
import { createBookService } from "@/features/books/bookService";

describe("createBookService", () => {
  it("creates a book and writes an audit log without touching a database", async () => {
    const repository = new InMemoryBookRepository();
    const { logger } = createCrudTestHarness();
    const service = createBookService(repository, logger);

    const created = await service.create(
      {
        title: "Unit Testing Guide",
        status: "published",
        ownerId: "u-03",
        ownerName: "Jamie Patel",
        notes: "Published guide for local unit testing.",
      },
      "unit-test-user",
    );

    expect(created.bookId).toBeTruthy();
    expect(logger.entries).toHaveLength(1);
    expect(logger.entries[0]?.shortNote).toBe("book created");
    expect(logger.entries[0]?.userId).toBe("unit-test-user");
  });

  it("rejects invalid archived notes through zod validation", async () => {
    const repository = new InMemoryBookRepository();
    const { logger } = createCrudTestHarness();
    const service = createBookService(repository, logger);

    await expect(
      service.create(
        {
          title: "Cleanup Plan",
          status: "archived",
          ownerId: "u-01",
          ownerName: "Alex Carter",
          notes: "Done",
        },
        "unit-test-user",
      ),
    ).rejects.toThrowError();
  });
});
