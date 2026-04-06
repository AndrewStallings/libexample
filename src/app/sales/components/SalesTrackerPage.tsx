"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { salesDemoStore, useSalesDemoStore } from "@/sales/services/salesDemoStore";
import { transformSalesByBookView, transformSalesByReviewerView } from "@/sales/logic/transformers";

type SalesViewMode = "book" | "reviewer";
type SalesSortMode = "date-desc" | "amount-desc" | "amount-asc";

export const SalesTrackerPage = () => {
  const { sales, currentUser } = useSalesDemoStore();
  const [viewMode, setViewMode] = useState<SalesViewMode>("book");
  const [filter, setFilter] = useState("");
  const [sortMode, setSortMode] = useState<SalesSortMode>("date-desc");

  const filteredSales = useMemo(() => {
    const next = sales
      .filter((record) => {
        const search = filter.trim().toLowerCase();
        if (!search) {
          return true;
        }
        return [record.saleId, record.bookTitle, record.reviewerName, record.channelName, record.saleType].some((value) =>
          value.toLowerCase().includes(search),
        );
      })
      .sort((left, right) => {
        if (sortMode === "amount-desc") {
          return right.totalAmount - left.totalAmount;
        }
        if (sortMode === "amount-asc") {
          return left.totalAmount - right.totalAmount;
        }
        return right.saleDate.localeCompare(left.saleDate);
      });

    return next;
  }, [filter, sales, sortMode]);

  const cards = useMemo(() => {
    return viewMode === "book" ? transformSalesByBookView(filteredSales) : transformSalesByReviewerView(filteredSales);
  }, [filteredSales, viewMode]);

  if (!salesDemoStore.canView()) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Access denied</h1>
        <p className="mt-4 text-lg text-stone-600">Only Sally can view the sales tracker. Current user: {currentUser.name}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-teal-700">Third Stress Test</p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Sales tracker with shared dataset, dual card views, and local transformations.</h1>
        <p className="mt-4 text-lg text-stone-600">
          The data is loaded once into a shared in-memory dataset and then transformed client-side into either sales-by-book or sales-by-reviewer
          cards without a second fetch.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href="/sales/new">
            Create Sale
          </Link>
          <button
            className="rounded-full border px-5 py-3 text-sm font-semibold"
            onClick={() => setViewMode((current) => (current === "book" ? "reviewer" : "book"))}
            type="button"
          >
            Switch to {viewMode === "book" ? "Sales by Reviewer" : "Sales by Book"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border bg-white/70 p-4 md:grid-cols-[1fr_auto_auto]">
        <input
          className="rounded-xl border px-4 py-3"
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter by book, reviewer, channel, sale id, or type"
          value={filter}
        />
        <select className="rounded-xl border px-4 py-3" onChange={(event) => setSortMode(event.target.value as SalesSortMode)} value={sortMode}>
          <option value="date-desc">Newest First</option>
          <option value="amount-desc">Amount High to Low</option>
          <option value="amount-asc">Amount Low to High</option>
        </select>
        <div className="flex items-center justify-end text-sm text-stone-600">{cards.length} records</div>
      </section>

      <section className="space-y-6">
        {cards.map((card) => (
          <EntityCard
            actions={
              <>
                {card.saleOptions.length === 1 ? (
                  <Link className={cardActionClassName} href={`/sales/${card.saleOptions[0].saleId}`}>
                    Open Form
                  </Link>
                ) : (
                  <details className="rounded-xl border bg-white px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold">Open Form</summary>
                    <div className="mt-3 flex flex-col gap-2">
                      {card.saleOptions.map((option) => (
                        <Link className={cardActionClassName} href={`/sales/${option.saleId}`} key={option.saleId}>
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                )}
                <CardActionButton>Read Only</CardActionButton>
              </>
            }
            key={card.cardKey}
            sections={card.sections}
          />
        ))}
      </section>
    </main>
  );
};
