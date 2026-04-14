import { createAppAuditLogger } from "@/config/auditLogger";
import type { AsyncComboboxOption } from "our-lib";

const supplierOptions: AsyncComboboxOption[] = [
  { label: "Fresh Cart", value: "Fresh Cart", description: "Local fruit and grab-and-go supplier." },
  { label: "Northwind Snacks", value: "Northwind Snacks", description: "Main distributor for salty packaged snacks." },
  { label: "Peak Protein Co.", value: "Peak Protein Co.", description: "Protein bars and high-volume vending refills." },
  { label: "Candy Cloud", value: "Candy Cloud", description: "Seasonal sweets and limited-run candy drops." },
];

export const loadSnackSupplierOptions = async (query: string): Promise<AsyncComboboxOption[]> => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return supplierOptions;
  }
  return supplierOptions.filter((option) => {
    return option.label.toLowerCase().includes(normalizedQuery) || option.description?.toLowerCase().includes(normalizedQuery);
  });
};
