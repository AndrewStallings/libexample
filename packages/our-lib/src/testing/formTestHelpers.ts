import { fireEvent, screen } from "@testing-library/react";

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
