import { BookPagesRouteClient } from "@/book-pages/components/BookPagesRouteClient";

type BookPagesRouteProps = {
  params: Promise<{ bookId: string }>;
};

const BookPagesPage = async ({ params }: BookPagesRouteProps) => {
  const { bookId } = await params;
  return <BookPagesRouteClient bookId={bookId} />;
};

export default BookPagesPage;
