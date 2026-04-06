import { notFound } from "next/navigation";
import { BookFormPage } from "@/books/components/BookFormPage";
import { getBookById } from "@/books/services/bookDemoService";

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
