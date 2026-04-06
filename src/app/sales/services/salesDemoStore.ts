"use client";

import { useSyncExternalStore } from "react";
import { InMemoryAuditLogger } from "our-lib";
import { canViewSalesTracker } from "@/sales/logic/rules";
import { InMemorySalesRepository } from "@/sales/data/salesRepository";
import type { SaleInput, SaleRecord, SaleRevision, SalesUser } from "@/sales/models/schemas";
import { createSalesService } from "@/sales/services/salesService";

const currentUser: SalesUser = {
  userId: "sales-sally",
  name: "Sally",
};

const repository = new InMemorySalesRepository();
const logger = new InMemoryAuditLogger();
const service = createSalesService(repository, logger);

type SalesDemoState = {
  sales: SaleRecord[];
  currentUser: SalesUser;
};

let state: SalesDemoState = {
  sales: [],
  currentUser,
};

const listeners = new Set<() => void>();
let initialized = false;

const emit = () => {
  listeners.forEach((listener) => listener());
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

void init();

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
