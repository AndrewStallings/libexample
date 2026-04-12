"use client";

import { useSyncExternalStore } from "react";
import { canViewSalesTracker } from "@/sales/logic/rules";
import { InMemorySalesRepository, initialSales } from "@/sales/data/salesRepository";
import type { SaleInput, SaleRecord, SaleRevision, SalesUser } from "@/sales/models/schemas";
import { createSalesService } from "@/sales/services/salesService";
import { createAppAuditLogger } from "@/config/auditLogger";
import { subscribeToRecordMutations } from "@/config/recordMutations";

const currentUser: SalesUser = {
  userId: "sales-sally",
  name: "Sally",
};

const repository = new InMemorySalesRepository();
const logger = createAppAuditLogger();
const service = createSalesService(repository, logger);

type SalesDemoState = {
  sales: SaleRecord[];
  currentUser: SalesUser;
};

let state: SalesDemoState = {
  sales: initialSales,
  currentUser,
};

const listeners = new Set<() => void>();
let initialized = false;

const emit = () => {
  listeners.forEach((listener) => listener());
};

const applySaleRecord = (record: SaleRecord) => {
  state = {
    ...state,
    sales: state.sales.some((item) => item.saleId === record.saleId)
      ? state.sales.map((item) => (item.saleId === record.saleId ? record : item))
      : [record, ...state.sales],
  };
  emit();
};

const removeSaleRecord = (saleId: string | number) => {
  state = {
    ...state,
    sales: state.sales.filter((item) => item.saleId !== saleId),
  };
  emit();
};

const refreshSales = async () => {
  state = {
    ...state,
    sales: await service.list(),
  };
  emit();
};

const init = async () => {
  if (initialized) {
    return;
  }
  initialized = true;
  await refreshSales();
};

void init().then(() => {
  subscribeToRecordMutations((event) => {
    if (event.entity !== "sale") {
      return;
    }

    if (event.mutation === "delete") {
      removeSaleRecord(event.recordId);
      return;
    }

    applySaleRecord(event.record as SaleRecord);
  });
});

export const salesDemoStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  canView: () => canViewSalesTracker(state.currentUser),
  refreshSales,
  listRevisions: (saleId: string): Promise<SaleRevision[]> => service.listRevisions(saleId),
  create: async (input: SaleInput) => {
    const created = await service.create(input, state.currentUser.name);
    await refreshSales();
    return created;
  },
  update: async (saleId: string, input: SaleInput) => {
    const updated = await service.update(saleId, input, state.currentUser.name);
    await refreshSales();
    return updated;
  },
  delete: async (saleId: string, reason: string) => {
    const result = await service.delete(saleId, reason, state.currentUser.name);
    await refreshSales();
    return result;
  },
  restoreRevision: async (saleId: string, revisionId: string) => {
    const restored = await service.restoreRevision(saleId, revisionId, state.currentUser.name);
    await refreshSales();
    return restored;
  },
  importSaleObject: async (input: SaleInput) => {
    const created = await service.importSaleObject(input, state.currentUser.name);
    await refreshSales();
    return created;
  },
  importBatch: async (inputs: SaleInput[]) => {
    const result = await service.importBatch(inputs, state.currentUser.name);
    await refreshSales();
    return result;
  },
};

export const useSalesDemoStore = () => {
  return useSyncExternalStore(salesDemoStore.subscribe, salesDemoStore.getSnapshot, salesDemoStore.getSnapshot);
};
