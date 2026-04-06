import { notFound } from "next/navigation";
import { BookPagesLibraryPage } from "@/book-pages/components/BookPagesLibraryPage";
import { getBookById } from "@/books/services/bookDemoService";

type BookPagesRouteProps = {
  params: Promise<{ bookId: string }>;
};

const BookPagesPage = async ({ params }: BookPagesRouteProps) => {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  return <BookPagesLibraryPage book={book} />;
};

export default BookPagesPage;
