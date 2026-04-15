import type { BookInput, BookRecord } from "@/books/models/schemas";

export const toBookInput = (record?: BookRecord): BookInput => {
  return {
    title: record?.title ?? "",
    status: record?.status ?? "draft",
    ownerId: record?.ownerId ?? "u-01",
    ownerName: record?.ownerName ?? "Alex Carter",
    notes: record?.notes ?? "",
  };
};
