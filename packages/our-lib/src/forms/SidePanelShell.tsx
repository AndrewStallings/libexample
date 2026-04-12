"use client";

import type { FormShellProps } from "./FormShell";
import { FormShell } from "./FormShell";

type SidePanelShellProps = Omit<FormShellProps, "variant">;

export const SidePanelShell = (props: SidePanelShellProps) => {
  return <FormShell {...props} variant="side-panel" />;
};
