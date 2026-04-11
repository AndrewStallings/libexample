export const queryKeys = {
  books: ["books"] as const,
  reviews: ["reviews"] as const,
  snacks: ["snacks"] as const,
  dropBoxLocations: ["drop-box-locations"] as const,
  bookPages: (bookId: string) => ["book-pages", bookId] as const,
};
