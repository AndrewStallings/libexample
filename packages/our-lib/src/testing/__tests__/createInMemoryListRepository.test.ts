import { describe, expect, it } from "vitest";
import { createInMemoryListRepository } from "../createInMemoryListRepository";

type BookRecord = {
  bookId: string;
  title: string;
  status: "draft" | "published";
};

describe("createInMemoryListRepository", () => {
  it("creates and updates records by mutating the backing list shape", async () => {
    const repository = createInMemoryListRepository<BookRecord, "bookId">({
      initialItems: [
        {
          bookId: "BK-1001",
          title: "API Standards Handbook",
          status: "published",
        },
      ],
      idKey: "bookId",
    });

    const created = await repository.create({
      bookId: "BK-1002",
      title: "Migration Runbook",
      status: "draft",
    });

    expect(created.bookId).toBe("BK-1002");

    const updated = await repository.update("BK-1001", {
      title: "API Standards Handbook Revised",
    });

    expect(updated).toEqual({
      bookId: "BK-1001",
      title: "API Standards Handbook Revised",
      status: "published",
    });

    const list = await repository.list();
    expect(list.items[0]?.bookId).toBe("BK-1002");
    expect(list.total).toBe(2);
  });
});
