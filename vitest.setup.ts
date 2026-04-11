import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { resetAllDemoStores } from "@/testing/resetDemoStores";

afterEach(() => {
  resetAllDemoStores();
});
