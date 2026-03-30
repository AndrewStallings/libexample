import { notFound } from "next/navigation";
import { ReviewFormPage } from "@/features/reviews/ReviewFormPage";
import { getReviewById } from "@/features/reviews/reviewDemoService";

type ReviewRouteProps = {
  params: Promise<{ id: string }>;
};

const ReviewEditPage = async ({ params }: ReviewRouteProps) => {
  const { id } = await params;
  const record = getReviewById(id);

  if (!record) {
    notFound();
  }

  return <ReviewFormPage mode="edit" record={record} />;
};

export default ReviewEditPage;
