import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { clickButton, fillFormFields } from "our-lib";
import { BookForm } from "@/books/components/BookForm";
import { createBookInput, createBookRecord } from "@/testing/fixtures/books";

describe("BookForm", () => {
  it("submits valid form values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<BookForm mode="create" initialValue={createBookInput()} onSubmit={onSubmit} />);

    fillFormFields({
      Title: "Testing Playbook",
      Notes: "Archive workflow testing notes",
    });
    fireEvent.change(screen.getByPlaceholderText("Search owners"), { target: { value: "Jamie" } });
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Jamie Patel/i })).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByRole("option", { name: /Jamie Patel/i }));
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

    render(<BookForm mode="create" initialValue={createBookInput()} onSubmit={onSubmit} />);

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
    render(<BookForm mode="edit" initialValue={createBookInput(record)} record={record} onSubmit={vi.fn()} />);

    expect(screen.getByText("Edit Book")).toBeInTheDocument();
    expect(screen.getByText(`ID: ${record.bookId}`)).toBeInTheDocument();
    expect(screen.getByText(`Last modified by ${record.updatedBy}`)).toBeInTheDocument();
  });
});

