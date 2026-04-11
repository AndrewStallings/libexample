import { describe, expect, it } from "vitest";
import { DbBookRepository, initialBooks } from "@/books/data/bookRepository";
import { createBookInput } from "@/testing/fixtures/books";

describe("DbBookRepository", () => {
  it("lists and reads books through the db adapter", async () => {
    const rows = initialBooks.map((book) => ({
      ...book,
      updatedAt: new Date(book.updatedAt),
    }));

    const repository = new DbBookRepository({
      select: () => ({
        from: async () => rows,
      }),
      insert: () => {
        throw new Error("insert should not be called in this test");
      },
      update: () => {
        throw new Error("update should not be called in this test");
      },
    });

    const result = await repository.list();
    const book = await repository.getById("BK-1002");

    expect(result.total).toBe(2);
    expect(result.items[0]?.updatedAt).toBe("2026-03-28T10:00:00.000Z");
    expect(book?.title).toBe("Migration Runbook");
  });

  it("creates and updates books through the db adapter", async () => {
    let insertedRow: unknown;
    let updatedValues: unknown;

    const repository = new DbBookRepository({
      select: () => ({
        from: async () =>
          initialBooks.map((book) => ({
            ...book,
            updatedAt: new Date(book.updatedAt),
          })),
      }),
      insert: () => ({
        values: (row) => {
          insertedRow = row;

          return {
            returning: async () => [row],
          };
        },
      }),
      update: () => ({
        set: (values) => {
          updatedValues = values;

          return {
            where: () => ({
              returning: async () => [
                {
                  bookId: "BK-1001",
                  title: "API Standards Handbook Revised",
                  status: "published",
                  ownerId: "u-02",
                  ownerName: "Morgan Lee",
                  notes: "Published archive update notes for the shared handbook.",
                  updatedAt: new Date("2026-04-09T20:00:00.000Z"),
                  updatedBy: "Morgan Lee",
                },
              ],
            }),
          };
        },
      }),
    });

    const created = await repository.create(
      createBookInput({
        title: "Repository Template",
        status: "draft",
        ownerId: "u-03",
        ownerName: "Jamie Patel",
        notes: "Draft notes for the db-backed repository template.",
      }),
    );

    const updated = await repository.update(
      "BK-1001",
      createBookInput({
        title: "API Standards Handbook Revised",
        status: "published",
        ownerId: "u-02",
        ownerName: "Morgan Lee",
        notes: "Published archive update notes for the shared handbook.",
      }),
    );

    expect(created.bookId).toBe("BK-1003");
    expect(insertedRow).toEqual(
      expect.objectContaining({
        bookId: "BK-1003",
        updatedBy: "Jamie Patel",
      }),
    );
    expect(updated.title).toBe("API Standards Handbook Revised");
    expect(updated.updatedAt).toBe("2026-04-09T20:00:00.000Z");
    expect(updatedValues).toEqual(
      expect.objectContaining({
        ownerName: "Morgan Lee",
        updatedBy: "Morgan Lee",
      }),
    );
  });
});
