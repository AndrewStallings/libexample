import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { BookPageForm } from "@/book-pages/components/BookPageForm";
import { toBookPageInput } from "@/book-pages/services/bookPageService";

describe("BookPageForm", () => {
  it("submits valid values after selecting an editor from the async combobox", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<BookPageForm initialValue={toBookPageInput("BK-1001")} mode="create" onSubmit={onSubmit} />);

    fillFormFields({
      "Page Title": "Credential Storage Rules",
      "Page Number": 55,
      Chapter: "Security Controls",
      Section: "Credentials",
      Audience: "Developers",
      Reviewer: "Alex Carter",
      "Word Count": 880,
      "Reading Time": 4,
      Illustrations: 1,
      Components: 2,
      Locale: "en-US",
      "SEO Title": "Credential Storage Rules",
      Slug: "credential-storage-rules",
      "Last Reviewed": "2026-03-30",
      Notes: "Page guidance for credential storage and access patterns.",
    });

    fireEvent.change(screen.getByLabelText("Editor"), { target: { value: "Sally" } });
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Sally Grant/i })).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByRole("option", { name: /Sally Grant/i }));

    clickButton("Create page");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          pageTitle: "Credential Storage Rules",
          editorId: "e-04",
          editorName: "Sally Grant",
        }),
      );
    });
  });
});
