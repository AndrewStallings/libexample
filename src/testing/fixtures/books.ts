import { initialBooks } from "@/books/data/bookRepository";
import type { BookInput, BookRecord } from "@/books/models/schemas";
import { toBookInput } from "@/books/services/bookDemoService";

export const createBookInput = (overrides: Partial<BookInput> = {}): BookInput => {
  return {
    ...toBookInput(),
    ...overrides,
  };
};

export const createBookRecord = (overrides: Partial<BookRecord> = {}): BookRecord => {
  return {
    ...initialBooks[0],
    ...overrides,
  };
};
