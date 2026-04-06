import type { SelectOption } from "our-lib";

export type SalesBook = {
  bookId: string;
  title: string;
};

export type SalesReviewer = {
  reviewerId: string;
  reviewerName: string;
};

export type SalesChannel = {
  channelId: string;
  channelName: string;
};

export const salesBooks: SalesBook[] = [
  { bookId: "sb-01", title: "API Standards Handbook" },
  { bookId: "sb-02", title: "Migration Runbook" },
  { bookId: "sb-03", title: "Release Checklist" },
  { bookId: "sb-04", title: "Compliance Notes" },
];

export const salesReviewers: SalesReviewer[] = [
  { reviewerId: "rv-01", reviewerName: "Sally" },
  { reviewerId: "rv-02", reviewerName: "Morgan" },
  { reviewerId: "rv-03", reviewerName: "Jamie" },
  { reviewerId: "rv-04", reviewerName: "Alex" },
];

export const salesChannels: SalesChannel[] = [
  { channelId: "ch-01", channelName: "Direct Website" },
  { channelId: "ch-02", channelName: "Downtown Store" },
  { channelId: "ch-03", channelName: "Campus Bookshop" },
  { channelId: "ch-04", channelName: "Marketplace Hub" },
];

export const saleTypeOptions: SelectOption[] = [
  { value: "instore", label: "In Store" },
  { value: "online", label: "Online" },
];

export const salesBookOptions: SelectOption[] = salesBooks.map((item) => ({
  value: item.bookId,
  label: item.title,
}));

export const salesReviewerOptions: SelectOption[] = salesReviewers.map((item) => ({
  value: item.reviewerId,
  label: item.reviewerName,
}));

export const salesChannelOptions: SelectOption[] = salesChannels.map((item) => ({
  value: item.channelId,
  label: item.channelName,
}));
