import { notFound } from "next/navigation";
import { BookFormPage } from "@/features/books/BookFormPage";
import { getBookById } from "@/features/books/bookDemoService";

type BookRouteProps = {
  params: Promise<{ id: string }>;
};

const BookEditPage = async ({ params }: BookRouteProps) => {
  const { id } = await params;
  const record = getBookById(id);

  if (!record) {
    notFound();
  }

  return <BookFormPage mode="edit" record={record} />;
};

export default BookEditPage;
