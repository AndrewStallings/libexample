"use server";

import type { BookInput } from "@/books/models/schemas";
import { createBook, listBooks, updateBook } from "@/books/services/bookService";

export const listBooksAction = async () => {
  return listBooks();
};

export const createBookAction = async (input: BookInput) => {
  return createBook(input);
};

export const updateBookAction = async (bookId: string, input: BookInput) => {
  return updateBook(bookId, input);
};
