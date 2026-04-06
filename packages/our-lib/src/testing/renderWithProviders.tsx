import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

type TestingProvidersProps = {
  children: ReactNode;
};

const TestingProviders = ({ children }: TestingProvidersProps) => {
  return <>{children}</>;
};

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  return render(ui, {
    wrapper: TestingProviders,
    ...options,
  });
};
