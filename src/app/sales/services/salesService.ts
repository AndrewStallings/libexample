import type { AuditLogEntry, AuditLogger } from "our-lib";
import { createSalesValidator, defaultSalesValidator, type SalesValidationOverride } from "@/sales/logic/rules";
import type { SalesRepository } from "@/sales/data/salesRepository";
import type { SaleDeleteReason, SaleInput, SaleRecord, SaleRevision } from "@/sales/models/schemas";

const createAuditLogEntry = (
  partial: Omit<AuditLogEntry, "time" | "severity"> & Partial<Pick<AuditLogEntry, "time" | "severity">>,
): AuditLogEntry => {
  return {
    ...partial,
    severity: partial.severity ?? "info",
    time: partial.time ?? new Date().toISOString(),
  };
};

export const createSalesService = (
  repository: SalesRepository,
  logger: AuditLogger,
  validationOverrides: SalesValidationOverride[] = [],
) => {
  const validate = validationOverrides.length > 0 ? createSalesValidator(validationOverrides) : defaultSalesValidator;

  const create = async (input: SaleInput, userName: string) => {
    const parsed = validate(input);
    if (!parsed.success) {
      throw parsed.error;
    }
    const created = await repository.createSale(parsed.data, userName);
    await logger.write(
      createAuditLogEntry({
        server: "local",
        shortNote: "sale created",
        longNote: `Sale ${created.saleId} was created`,
        source: "salesService",
        category: "sale",
        route: "/sales",
        userId: userName,
      }),
    );
    return created;
  };

  return {
    list: () => repository.listSales(),
    getById: (id: string) => repository.getSaleById(id),
    listReviewers: () => repository.listReviewers(),
    listRevisions: (saleId: string): Promise<SaleRevision[]> => repository.listRevisions(saleId),
    listDeleteReasons: (): Promise<SaleDeleteReason[]> => repository.listDeleteReasons(),
    create,
    update: async (saleId: string, input: SaleInput, userName: string) => {
      const parsed = validate(input);
      if (!parsed.success) {
        throw parsed.error;
      }
      const updated = await repository.updateSale(saleId, parsed.data, userName);
      await logger.write(
        createAuditLogEntry({
          server: "local",
          shortNote: "sale updated",
          longNote: `Sale ${updated.saleId} was updated`,
          source: "salesService",
          category: "sale",
          route: "/sales",
          userId: userName,
        }),
      );
      return updated;
    },
    delete: async (saleId: string, reason: string, userName: string) => {
      const result = await repository.deleteSale(saleId, reason, userName);
      await logger.write(
        createAuditLogEntry({
          server: "local",
          shortNote: "sale deleted",
          longNote: `Sale ${saleId} was deleted`,
          source: "salesService",
          category: "sale",
          route: "/sales",
          userId: userName,
        }),
      );
      return result;
    },
    restoreRevision: async (saleId: string, revisionId: string, userName: string) => {
      return repository.restoreRevision(saleId, revisionId, userName);
    },
    importSaleObject: async (input: SaleInput, userName: string) => {
      return create(input, userName);
    },
    importBatch: async (inputs: SaleInput[], userName: string) => {
      const normalized: SaleInput[] = [];
      for (const input of inputs) {
        const parsed = validate(input);
        if (!parsed.success) {
          throw parsed.error;
        }
        normalized.push(parsed.data);
      }
      return repository.importSales(normalized, userName);
    },
    validate,
  };
};
