import { describe, expect, it } from "vitest";
import { transformSalesByBookView, transformSalesByReviewerView } from "@/sales/logic/transformers";
import { InMemorySalesRepository } from "@/sales/data/salesRepository";

describe("salesTransformers", () => {
  it("maps the same dataset into book view cards", async () => {
    const repository = new InMemorySalesRepository();
    const records = await repository.listSales();
    const cards = transformSalesByBookView(records);

    expect(cards[0]?.title).toBe(records[0]?.bookTitle);
  });

  it("maps the same dataset into reviewer view cards", async () => {
    const repository = new InMemorySalesRepository();
    const records = await repository.listSales();
    const cards = transformSalesByReviewerView(records);

    const uniqueReviewers = new Set(records.map((record) => record.reviewerId));
    expect(cards).toHaveLength(uniqueReviewers.size);
    expect(cards[0]?.saleOptions.length).toBeGreaterThan(0);
  });
});
