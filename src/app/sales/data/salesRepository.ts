import type { EntityId } from "our-lib";
import { salesBooks, salesChannels, salesReviewers } from "@/sales/models/lookupData";
import type { SaleDeleteReason, SaleInput, SaleRecord, SaleRevision } from "@/sales/models/schemas";

type SaleRow = {
  saleId: string;
  bookId: string;
  reviewerId: string;
  channelId: string;
  saleType: SaleInput["saleType"];
  quantity: number;
  totalAmount: number;
  saleDate: string;
  storeLocation?: string;
  marketplace?: string;
  orderId?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

const reviewerSeed = [...salesReviewers];

const joinSaleRecord = (row: SaleRow, reviewers = reviewerSeed): SaleRecord => {
  const book = salesBooks.find((item) => item.bookId === row.bookId);
  const reviewer = reviewers.find((item) => item.reviewerId === row.reviewerId);
  const channel = salesChannels.find((item) => item.channelId === row.channelId);

  return {
    saleId: row.saleId,
    bookId: row.bookId,
    bookTitle: book?.title ?? row.bookId,
    reviewerId: row.reviewerId,
    reviewerName: reviewer?.reviewerName ?? row.reviewerId,
    channelId: row.channelId,
    channelName: channel?.channelName ?? row.channelId,
    saleType: row.saleType,
    quantity: row.quantity,
    totalAmount: row.totalAmount,
    saleDate: row.saleDate,
    storeLocation: row.storeLocation,
    marketplace: row.marketplace,
    orderId: row.orderId,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    updatedBy: row.updatedBy,
    updatedAt: row.updatedAt,
  };
};

const createRevision = (saleId: string, snapshot: SaleRecord, changedBy: string, action: SaleRevision["action"]): SaleRevision => {
  return {
    revisionId: `${saleId}-${action}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    saleId,
    action,
    changedAt: new Date().toISOString(),
    changedBy,
    snapshot,
  };
};

export const initialSaleRows: SaleRow[] = [
  { saleId: "SL-3001", bookId: "sb-01", reviewerId: "rv-01", channelId: "ch-01", saleType: "online", quantity: 4, totalAmount: 119.96, saleDate: "2026-03-01", marketplace: "Website", orderId: "ORD-1001", createdBy: "Sally", createdAt: "2026-03-01T10:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-01T10:00:00.000Z" },
  { saleId: "SL-3002", bookId: "sb-02", reviewerId: "rv-01", channelId: "ch-02", saleType: "instore", quantity: 2, totalAmount: 59.98, saleDate: "2026-03-02", storeLocation: "Downtown", createdBy: "Sally", createdAt: "2026-03-02T11:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-02T11:00:00.000Z" },
  { saleId: "SL-3003", bookId: "sb-03", reviewerId: "rv-01", channelId: "ch-03", saleType: "instore", quantity: 1, totalAmount: 24.99, saleDate: "2026-03-03", storeLocation: "Campus", createdBy: "Sally", createdAt: "2026-03-03T12:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-03T12:00:00.000Z" },
  { saleId: "SL-3004", bookId: "sb-04", reviewerId: "rv-02", channelId: "ch-04", saleType: "online", quantity: 5, totalAmount: 199.95, saleDate: "2026-03-04", marketplace: "Marketplace Hub", orderId: "ORD-1004", createdBy: "Sally", createdAt: "2026-03-04T13:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-04T13:00:00.000Z" },
  { saleId: "SL-3005", bookId: "sb-01", reviewerId: "rv-02", channelId: "ch-01", saleType: "online", quantity: 3, totalAmount: 89.97, saleDate: "2026-03-05", marketplace: "Website", orderId: "ORD-1005", createdBy: "Sally", createdAt: "2026-03-05T14:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-05T14:00:00.000Z" },
  { saleId: "SL-3006", bookId: "sb-02", reviewerId: "rv-03", channelId: "ch-02", saleType: "instore", quantity: 6, totalAmount: 179.94, saleDate: "2026-03-06", storeLocation: "Downtown", createdBy: "Sally", createdAt: "2026-03-06T15:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-06T15:00:00.000Z" },
  { saleId: "SL-3007", bookId: "sb-03", reviewerId: "rv-03", channelId: "ch-03", saleType: "instore", quantity: 4, totalAmount: 99.96, saleDate: "2026-03-07", storeLocation: "Campus", createdBy: "Sally", createdAt: "2026-03-07T16:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-07T16:00:00.000Z" },
  { saleId: "SL-3008", bookId: "sb-04", reviewerId: "rv-03", channelId: "ch-04", saleType: "online", quantity: 2, totalAmount: 79.98, saleDate: "2026-03-08", marketplace: "Marketplace Hub", orderId: "ORD-1008", createdBy: "Sally", createdAt: "2026-03-08T17:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-08T17:00:00.000Z" },
  { saleId: "SL-3009", bookId: "sb-01", reviewerId: "rv-04", channelId: "ch-01", saleType: "online", quantity: 1, totalAmount: 29.99, saleDate: "2026-03-09", marketplace: "Website", orderId: "ORD-1009", createdBy: "Sally", createdAt: "2026-03-09T18:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-09T18:00:00.000Z" },
  { saleId: "SL-3010", bookId: "sb-02", reviewerId: "rv-04", channelId: "ch-02", saleType: "instore", quantity: 7, totalAmount: 209.93, saleDate: "2026-03-10", storeLocation: "Downtown", createdBy: "Sally", createdAt: "2026-03-10T19:00:00.000Z", updatedBy: "Sally", updatedAt: "2026-03-10T19:00:00.000Z" },
];

export const initialSales: SaleRecord[] = initialSaleRows.map((row) => joinSaleRecord(row, reviewerSeed));

export type SalesRepository = {
  listSales(): Promise<SaleRecord[]>;
  getSaleById(id: EntityId): Promise<SaleRecord | null>;
  createSale(input: SaleInput, userName: string): Promise<SaleRecord>;
  updateSale(id: EntityId, input: SaleInput, userName: string): Promise<SaleRecord>;
  deleteSale(id: EntityId, reason: string, userName: string): Promise<{ deletedSaleId: string; deletedReviewerId?: string }>;
  listRevisions(saleId: EntityId): Promise<SaleRevision[]>;
  restoreRevision(saleId: EntityId, revisionId: string, userName: string): Promise<SaleRecord>;
  importSales(inputs: SaleInput[], userName: string): Promise<SaleRecord[]>;
  listDeleteReasons(): Promise<SaleDeleteReason[]>;
  listReviewers(): Promise<typeof reviewerSeed>;
};

export class InMemorySalesRepository implements SalesRepository {
  private sales = [...initialSaleRows];
  private reviewers = [...reviewerSeed];
  private revisions: SaleRevision[] = [];
  private deleteReasons: SaleDeleteReason[] = [];

  listSales = async (): Promise<SaleRecord[]> => {
    return this.sales.map((row) => joinSaleRecord(row, this.reviewers));
  };

  getSaleById = async (id: EntityId): Promise<SaleRecord | null> => {
    const row = this.sales.find((item) => item.saleId === id);
    return row ? joinSaleRecord(row, this.reviewers) : null;
  };

  createSale = async (input: SaleInput, userName: string): Promise<SaleRecord> => {
    const now = new Date().toISOString();
    const row: SaleRow = {
      saleId: `SL-${3000 + this.sales.length + 1}`,
      ...input,
      createdBy: userName,
      createdAt: now,
      updatedBy: userName,
      updatedAt: now,
    };

    this.sales = [row, ...this.sales];
    return joinSaleRecord(row, this.reviewers);
  };

  updateSale = async (id: EntityId, input: SaleInput, userName: string): Promise<SaleRecord> => {
    const index = this.sales.findIndex((item) => item.saleId === id);
    if (index < 0) {
      throw new Error(`Sale ${id} was not found`);
    }

    const existing = this.sales[index];
    const updatedRow: SaleRow = {
      ...existing,
      ...input,
      updatedBy: userName,
      updatedAt: new Date().toISOString(),
    };

    this.sales[index] = updatedRow;
    const record = joinSaleRecord(updatedRow, this.reviewers);
    this.revisions.unshift(createRevision(String(id), record, userName, "edit"));
    return record;
  };

  deleteSale = async (id: EntityId, reason: string, userName: string) => {
    const sale = this.sales.find((item) => item.saleId === id);
    if (!sale) {
      throw new Error(`Sale ${id} was not found`);
    }

    this.deleteReasons.unshift({
      deleteReasonId: `${sale.saleId}-delete-${Date.now()}`,
      oldSaleId: sale.saleId,
      reason,
      deletedAt: new Date().toISOString(),
      deletedBy: userName,
    });

    this.sales = this.sales.filter((item) => item.saleId !== id);

    const reviewerHasRemainingSales = this.sales.some((item) => item.reviewerId === sale.reviewerId);
    let deletedReviewerId: string | undefined;

    if (!reviewerHasRemainingSales) {
      this.reviewers = this.reviewers.filter((item) => item.reviewerId !== sale.reviewerId);
      deletedReviewerId = sale.reviewerId;
    }

    return {
      deletedSaleId: sale.saleId,
      deletedReviewerId,
    };
  };

  listRevisions = async (saleId: EntityId): Promise<SaleRevision[]> => {
    return this.revisions.filter((item) => item.saleId === saleId).slice(0, 5);
  };

  restoreRevision = async (saleId: EntityId, revisionId: string, userName: string): Promise<SaleRecord> => {
    const revision = this.revisions.find((item) => item.saleId === saleId && item.revisionId === revisionId);
    const index = this.sales.findIndex((item) => item.saleId === saleId);

    if (!revision || index < 0) {
      throw new Error(`Revision ${revisionId} was not found`);
    }

    const restoredRow: SaleRow = {
      saleId: revision.snapshot.saleId,
      bookId: revision.snapshot.bookId,
      reviewerId: revision.snapshot.reviewerId,
      channelId: revision.snapshot.channelId,
      saleType: revision.snapshot.saleType,
      quantity: revision.snapshot.quantity,
      totalAmount: revision.snapshot.totalAmount,
      saleDate: revision.snapshot.saleDate,
      storeLocation: revision.snapshot.storeLocation,
      marketplace: revision.snapshot.marketplace,
      orderId: revision.snapshot.orderId,
      createdBy: revision.snapshot.createdBy,
      createdAt: revision.snapshot.createdAt,
      updatedBy: userName,
      updatedAt: new Date().toISOString(),
    };

    this.sales[index] = restoredRow;
    const restoredRecord = joinSaleRecord(restoredRow, this.reviewers);
    this.revisions.unshift(createRevision(String(saleId), restoredRecord, userName, "restore"));
    return restoredRecord;
  };

  importSales = async (inputs: SaleInput[], userName: string): Promise<SaleRecord[]> => {
    const created: SaleRecord[] = [];
    for (const input of inputs) {
      created.push(await this.createSale(input, userName));
    }
    return created;
  };

  listDeleteReasons = async (): Promise<SaleDeleteReason[]> => {
    return [...this.deleteReasons];
  };

  listReviewers = async () => {
    return [...this.reviewers];
  };
}
