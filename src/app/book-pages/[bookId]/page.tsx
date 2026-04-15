import { notFound } from "next/navigation";
import { BookPagesLibraryPage } from "@/book-pages/components/BookPagesLibraryPage";
import { getBookPagesByBookId } from "@/book-pages/services/bookPageService";
import { getBookById } from "@/books/services/bookService";

type BookPagesRouteProps = {
  params: Promise<{ bookId: string }>;
};

const BookPagesPage = async ({ params }: BookPagesRouteProps) => {
  const { bookId } = await params;
  const [book, initialPageRecords] = await Promise.all([getBookById(bookId), getBookPagesByBookId(bookId)]);

  if (!book) {
    notFound();
  }

  return <BookPagesLibraryPage book={book} initialPageRecords={initialPageRecords} />;
};

export default BookPagesPage;
