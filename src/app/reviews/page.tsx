import { ReviewsLibraryPage } from "@/reviews/components/ReviewsLibraryPage";
import { listReviews } from "@/reviews/services/reviewService";

const ReviewsPage = async () => {
  const initialReviews = await listReviews();

  return <ReviewsLibraryPage initialReviews={initialReviews} />;
};

export default ReviewsPage;
