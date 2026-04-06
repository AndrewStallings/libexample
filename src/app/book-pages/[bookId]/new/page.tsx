import { notFound } from "next/navigation";
import { BookPageFormPage } from "@/book-pages/components/BookPageFormPage";
import { getBookById } from "@/books/services/bookDemoService";

type NewBookPageRouteProps = {
  params: Promise<{ bookId: string }>;
};

const NewBookChildPage = async ({ params }: NewBookPageRouteProps) => {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  return <BookPageFormPage book={book} mode="create" />;
};

export default NewBookChildPage;
