export const districtManagerOptions = [
  { value: "Sally Grant", label: "Sally Grant", description: "Regional operations lead" },
  { value: "Taylor Brooks", label: "Taylor Brooks", description: "Campus logistics manager" },
  { value: "Jordan Kim", label: "Jordan Kim", description: "City route supervisor" },
  { value: "Priya Shah", label: "Priya Shah", description: "Overflow and special handling manager" },
];

export const loadDistrictManagerOptions = async (query: string) => {
  await Promise.resolve();

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return districtManagerOptions;
  }

  return districtManagerOptions.filter((option) => {
    return option.label.toLowerCase().includes(normalized) || option.description.toLowerCase().includes(normalized);
  });
};
