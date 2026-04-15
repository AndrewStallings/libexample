import { BooksLibraryPage } from "@/books/components/BooksLibraryPage";
import { listBooks } from "@/books/services/bookService";

const BooksPage = async () => {
  const initialBooks = await listBooks();

  return <BooksLibraryPage initialBooks={initialBooks} />;
};

export default BooksPage;
