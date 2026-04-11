import { resetBookPageDemoStore } from "@/book-pages/services/bookPageDemoService";
import { resetBookDemoStore } from "@/books/services/bookDemoService";
import { resetDropBoxLocationDemoStore } from "@/drop-box-locations/services/dropBoxLocationDemoService";
import { resetReviewDemoStore } from "@/reviews/services/reviewDemoService";
import { resetSnackDemoStore } from "@/snacks/services/snackDemoService";

export const resetAllDemoStores = () => {
  resetBookDemoStore();
  resetBookPageDemoStore();
  resetReviewDemoStore();
  resetSnackDemoStore();
  resetDropBoxLocationDemoStore();
};
