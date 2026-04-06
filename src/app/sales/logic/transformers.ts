import type { EntityCardSection } from "our-lib";
import type { SaleRecord } from "@/sales/models/schemas";

export type SalesCardModel = {
  cardKey: string;
  title: string;
  subtitle: string;
  sections: EntityCardSection[];
  saleOptions: Array<{
    saleId: string;
    label: string;
  }>;
};

export const transformSalesByBookView = (records: SaleRecord[]): SalesCardModel[] => {
  return records.map((record) => ({
    cardKey: `book-${record.saleId}`,
    title: record.bookTitle,
    subtitle: `Sale ${record.saleId}`,
    sections: [
      {
        title: "Book",
        items: [
          { value: record.bookTitle, label: "Book", prominent: true },
          { value: record.reviewerName, label: "Reviewer" },
          { value: record.channelName, label: "Channel" },
        ],
      },
      {
        title: "Sale",
        items: [
          { value: `${record.quantity}`, label: "Quantity" },
          { value: `$${record.totalAmount.toFixed(2)}`, label: "Amount" },
          { value: record.saleDate, label: "Date" },
          { value: record.saleType, label: "Type" },
        ],
      },
    ],
    saleOptions: [
      {
        saleId: record.saleId,
        label: `${record.saleId} - ${record.bookTitle}`,
      },
    ],
  }));
};

export const transformSalesByReviewerView = (records: SaleRecord[]): SalesCardModel[] => {
  const grouped = records.reduce<Map<string, SaleRecord[]>>((accumulator, record) => {
    const existing = accumulator.get(record.reviewerId) ?? [];
    existing.push(record);
    accumulator.set(record.reviewerId, existing);
    return accumulator;
  }, new Map());

  return [...grouped.entries()].map(([reviewerId, reviewerSales]) => {
    const firstSale = reviewerSales[0];
    const totalAmount = reviewerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = reviewerSales.reduce((sum, sale) => sum + sale.quantity, 0);

    return {
      cardKey: `reviewer-${reviewerId}`,
      title: firstSale.reviewerName,
      subtitle: `${reviewerSales.length} sales`,
      sections: [
        {
          title: "Reviewer",
          items: [
            { value: firstSale.reviewerName, label: "Reviewer", prominent: true },
            { value: `${reviewerSales.length}`, label: "Sale Count" },
            { value: `${totalQuantity}`, label: "Books Sold" },
          ],
        },
        {
          title: "Books",
          items: reviewerSales.map((sale) => ({
            value: sale.bookTitle,
            label: `${sale.saleId} - ${sale.channelName}`,
          })),
        },
        {
          title: "Totals",
          items: [
            { value: `$${totalAmount.toFixed(2)}`, label: "Total Amount" },
            { value: reviewerSales[0].saleType, label: "Latest Type" },
          ],
        },
      ],
      saleOptions: reviewerSales.map((sale) => ({
        saleId: sale.saleId,
        label: `${sale.saleId} - ${sale.bookTitle}`,
      })),
    };
  });
};
