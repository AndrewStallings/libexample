import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useResourceFormState } from "../useResourceFormState";

describe("useResourceFormState", () => {
  it("creates a record and applies the default success message", async () => {
    const createRecord = vi.fn(async (input: { name: string }) => ({
      recordId: "REC-100",
      ...input,
    }));

    const { result } = renderHook(() =>
      useResourceFormState({
        mode: "create",
        createRecord,
        updateRecord: async (record: { recordId: string; name: string }, input: { name: string }) => ({
          ...record,
          ...input,
        }),
        getRecordId: (record) => record.recordId,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Created record" });
    });

    expect(createRecord).toHaveBeenCalledWith({ name: "Created record" });
    expect(result.current.currentRecord).toEqual({ recordId: "REC-100", name: "Created record" });
    expect(result.current.statusMessage).toBe("Created REC-100.");
  });

  it("updates a record and applies the default update message", async () => {
    const updateRecord = vi.fn(async (_record: { recordId: string; name: string }, input: { name: string }) => ({
      recordId: "REC-200",
      ...input,
    }));

    const { result } = renderHook(() =>
      useResourceFormState({
        mode: "edit",
        initialRecord: { recordId: "REC-200", name: "Original name" },
        createRecord: async (input: { name: string }) => ({ recordId: "REC-201", ...input }),
        updateRecord,
        getRecordId: (record) => record.recordId,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Updated name" });
    });

    expect(updateRecord).toHaveBeenCalledWith({ recordId: "REC-200", name: "Original name" }, { name: "Updated name" });
    expect(result.current.currentRecord).toEqual({ recordId: "REC-200", name: "Updated name" });
    expect(result.current.statusMessage).toBe("Saved changes for REC-200.");
  });

  it("reports a consistent message when edit mode has no record", async () => {
    const { result } = renderHook(() =>
      useResourceFormState({
        mode: "edit",
        createRecord: async (input: { name: string }) => ({ recordId: "REC-300", ...input }),
        updateRecord: async (record: { recordId: string; name: string }, input: { name: string }) => ({
          ...record,
          ...input,
        }),
        getRecordId: (record) => record.recordId,
        entityLabel: "location",
      }),
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Ignored" });
    });

    expect(result.current.statusMessage).toBe("No location was available to update.");
  });
});
