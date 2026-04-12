"use client";

import type { FormShellProps } from "./FormShell";
import { FormShell } from "./FormShell";

type FormPageShellProps = Omit<FormShellProps, "variant" | "isOpen" | "onClose">;

export const FormPageShell = (props: FormPageShellProps) => {
  return <FormShell {...props} variant="page" />;
};
