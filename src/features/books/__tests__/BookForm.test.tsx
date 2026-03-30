import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookForm } from "@/features/books/BookForm";
import { toBookInput } from "@/features/books/bookDemoService";
import { initialBooks } from "@/features/books/bookRepository";

describe("BookForm", () => {
  it("submits valid form values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<BookForm mode="create" initialValue={toBookInput()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Testing Playbook" } });
    fireEvent.change(screen.getByLabelText("Owner"), { target: { value: "u-03" } });
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Archive workflow testing notes" } });
    fireEvent.click(screen.getByRole("button", { name: "Create record" }));

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

    render(<BookForm mode="create" initialValue={toBookInput()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Archive Plan" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "archived" } });
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Needs follow up" } });
    fireEvent.click(screen.getByRole("button", { name: "Create record" }));

    await waitFor(() => {
      expect(screen.getByText("Archived items should explain why they were archived.")).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders record metadata in edit mode", () => {
    render(<BookForm mode="edit" initialValue={toBookInput(initialBooks[0])} record={initialBooks[0]} onSubmit={vi.fn()} />);

    expect(screen.getByText("Edit Book")).toBeInTheDocument();
    expect(screen.getByText(`ID: ${initialBooks[0].bookId}`)).toBeInTheDocument();
    expect(screen.getByText(`Last modified by ${initialBooks[0].updatedBy}`)).toBeInTheDocument();
  });
});
