import { BooksLibraryPage } from "@/books/components/BooksLibraryPage";
import { listBooks } from "@/books/services/bookService";

const HomePage = async () => {
  const initialBooks = await listBooks();

  return <BooksLibraryPage initialBooks={initialBooks} />;
};

export default HomePage;
