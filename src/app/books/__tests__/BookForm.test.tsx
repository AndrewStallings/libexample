import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields, renderWithProviders, selectAsyncComboboxOption } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { createBookInput, createBookRecord } from "@/testing/fixtures/books";

describe("BookForm", () => {
  it("submits valid form values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<BookForm mode="create" initialValue={createBookInput()} onSubmit={onSubmit} />);

    fillFormFields({
      Title: "Testing Playbook",
      Notes: "Archive workflow testing notes",
    });
    await selectAsyncComboboxOption("Search owners", "Jamie", /Jamie Patel/i);
    clickButton("Create record");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Testing Playbook",
        status: "draft",
        ownerId: "u-03",
        ownerName: "Jamie Patel",
        notes: "Archive workflow testing notes",
      });
    });
  });

  it("shows validation feedback and blocks submit when archived notes are incomplete", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<BookForm mode="create" initialValue={createBookInput()} onSubmit={onSubmit} />);

    fillFormFields({
      Title: "Archive Plan",
      Status: "archived",
      Notes: "Needs follow up",
    });
    clickButton("Create record");

    await waitFor(() => {
      expect(screen.getByText("Archived items should explain why they were archived.")).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders record metadata in edit mode", () => {
    const record = createBookRecord();
    renderWithProviders(<BookForm mode="edit" initialValue={createBookInput(record)} record={record} onSubmit={vi.fn()} />);

    expect(screen.getByText("Edit Book")).toBeInTheDocument();
    expect(screen.getByText(`ID: ${record.bookId}`)).toBeInTheDocument();
    expect(screen.getByText(`Last modified by ${record.updatedBy}`)).toBeInTheDocument();
  });

  it("renders the create button label in create mode", () => {
    renderWithProviders(<BookForm mode="create" initialValue={createBookInput()} onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Create record" })).toBeInTheDocument();
  });

  it("renders the save button label in edit mode", () => {
    const record = createBookRecord();
    renderWithProviders(<BookForm mode="edit" initialValue={createBookInput(record)} record={record} onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("updates owner name after selecting an async owner option", async () => {
    renderWithProviders(<BookForm mode="create" initialValue={createBookInput()} onSubmit={vi.fn()} />);

    await selectAsyncComboboxOption("Search owners", "Morgan", /Morgan Lee/i);

    await waitFor(() => {
      expect(screen.getAllByDisplayValue("Morgan Lee").length).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps the default owner name visible on first render", () => {
    renderWithProviders(<BookForm mode="create" initialValue={createBookInput()} onSubmit={vi.fn()} />);

    expect(screen.getAllByDisplayValue("Alex Carter").length).toBeGreaterThanOrEqual(2);
  });

  it("submits edited values in edit mode", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const record = createBookRecord();

    renderWithProviders(<BookForm mode="edit" initialValue={createBookInput(record)} record={record} onSubmit={onSubmit} />);

    fillFormFields({
      Title: "Migration Runbook Updated",
      Notes: "Archive remediation notes for the updated edition.",
    });
    clickButton("Save changes");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Migration Runbook Updated",
        status: record.status,
        ownerId: record.ownerId,
        ownerName: record.ownerName,
        notes: "Archive remediation notes for the updated edition.",
      });
    });
  });
});

