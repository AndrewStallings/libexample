import { resetBookPageDemoStore } from "@/book-pages/services/bookPageDemoService";
import { resetBookDemoStore } from "@/books/services/bookDemoService";
import { resetReviewDemoStore } from "@/reviews/services/reviewDemoService";
import { resetSnackDemoStore } from "@/snacks/services/snackDemoService";

export const resetAllDemoStores = () => {
  resetBookDemoStore();
  resetBookPageDemoStore();
  resetReviewDemoStore();
  resetSnackDemoStore();
};
