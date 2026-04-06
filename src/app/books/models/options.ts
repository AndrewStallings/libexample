import type { SelectOption } from "our-lib";

export const ownerOptions: SelectOption[] = [
  { value: "u-01", label: "Alex Carter" },
  { value: "u-02", label: "Morgan Lee" },
  { value: "u-03", label: "Jamie Patel" },
];

export const loadOwnerOptions = async (query: string) => {
  await Promise.resolve();

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return ownerOptions;
  }

  return ownerOptions.filter((option) => option.label.toLowerCase().includes(normalized) || option.value.toLowerCase().includes(normalized));
};
