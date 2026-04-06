import { notFound } from "next/navigation";
import { BookPageFormPage } from "@/book-pages/components/BookPageFormPage";
import { getBookPageById } from "@/book-pages/services/bookPageDemoService";
import { getBookById } from "@/books/services/bookDemoService";

type BookPageRouteProps = {
  params: Promise<{ bookId: string; pageId: string }>;
};

const BookPageEditPage = async ({ params }: BookPageRouteProps) => {
  const { bookId, pageId } = await params;
  const book = getBookById(bookId);
  const pageRecord = getBookPageById(pageId);

  if (!book || !pageRecord || pageRecord.bookId !== book.bookId) {
    notFound();
  }

  return <BookPageFormPage book={book} mode="edit" pageRecord={pageRecord} />;
};

export default BookPageEditPage;
