"use server";

import type { BookPageInput } from "@/book-pages/models/schemas";
import { createBookPage, getBookPagesByBookId, updateBookPage } from "@/book-pages/services/bookPageService";

export const listBookPagesByBookIdAction = async (bookId: string) => {
  return getBookPagesByBookId(bookId);
};

export const createBookPageAction = async (input: BookPageInput) => {
  return createBookPage(input);
};

export const updateBookPageAction = async (pageId: string, input: BookPageInput) => {
  return updateBookPage(pageId, input);
};
