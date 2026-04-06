export const editorOptions = [
  { value: "e-01", label: "Taylor Brooks", description: "Editorial lead for standards content" },
  { value: "e-02", label: "Jordan Kim", description: "Design systems editor" },
  { value: "e-03", label: "Priya Shah", description: "Migration and rollout specialist" },
  { value: "e-04", label: "Sally Grant", description: "Release and operations reviewer" },
];

export const loadEditorOptions = async (query: string) => {
  await Promise.resolve();

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return editorOptions;
  }

  return editorOptions.filter((option) => {
    return (
      option.label.toLowerCase().includes(normalized) ||
      option.value.toLowerCase().includes(normalized) ||
      option.description.toLowerCase().includes(normalized)
    );
  });
};
