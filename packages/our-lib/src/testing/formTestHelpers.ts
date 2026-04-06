import { fireEvent, screen, waitFor } from "@testing-library/react";

export const fillFormFields = (values: Record<string, string | number>) => {
  for (const [label, value] of Object.entries(values)) {
    const field =
      screen.queryByLabelText(label) ??
      screen.queryByRole("combobox", { name: label }) ??
      screen.queryByRole("textbox", { name: label });

    if (!field) {
      throw new Error(`Unable to find a form field named "${label}".`);
    }

    fireEvent.change(field, { target: { value: String(value) } });
  }
};

export const clickButton = (name: string) => {
  fireEvent.click(screen.getByRole("button", { name }));
};

export const queryField = (label: string) => {
  return (
    screen.queryByLabelText(label) ??
    screen.queryByRole("combobox", { name: label }) ??
    screen.queryByRole("textbox", { name: label })
  );
};

export const getField = (label: string) => {
  const field = queryField(label);
  if (!field) {
    throw new Error(`Unable to find a form field named "${label}".`);
  }
  return field;
};

export const selectAsyncComboboxOption = async (placeholder: string, query: string, optionName: string | RegExp) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: query } });
  await waitFor(() => {
    screen.getByRole("option", { name: optionName });
  });
  fireEvent.mouseDown(screen.getByRole("option", { name: optionName }));
};
