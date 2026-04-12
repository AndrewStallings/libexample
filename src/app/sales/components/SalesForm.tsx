"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormFrame, FormSelectField, FormTextAreaField, FormTextField } from "our-lib";
import { saleTypeOptions, salesBookOptions, salesChannelOptions, salesReviewerOptions } from "@/sales/models/lookupData";
import { defaultSalesValidator, getSaleFieldVisibility } from "@/sales/logic/rules";
import type { SaleInput, SaleRecord } from "@/sales/models/schemas";

type SalesFormProps = {
  mode: "create" | "edit" | "read";
  initialValue: SaleInput;
  record?: SaleRecord;
  onSubmit: (value: SaleInput) => Promise<void>;
  onImportObject?: () => void;
};

const sampleImportedSale: SaleInput = {
  bookId: "sb-03",
  reviewerId: "rv-02",
  channelId: "ch-04",
  saleType: "online",
  quantity: 2,
  totalAmount: 54.99,
  saleDate: "2026-03-15",
  marketplace: "Marketplace Hub",
  orderId: "IMP-4001",
  storeLocation: "",
};

export const SalesForm = ({ mode, initialValue, record, onSubmit, onImportObject }: SalesFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saleType, setSaleType] = useState<SaleInput["saleType"]>(initialValue.saleType);
  const isReadOnly = mode === "read";
  const conditionalFieldPlaceholder = (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-dashed opacity-0"
      style={{ borderColor: "var(--border)", minHeight: "7.25rem" }}
    />
  );

  const form = useForm({
    defaultValues: initialValue,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      const parsed = defaultSalesValidator(value);
      if (!parsed.success) {
        setSubmitError(parsed.error.issues[0]?.message ?? "Validation failed");
        return;
      }
      await onSubmit(parsed.data);
    },
  });

  const visibleFields = getSaleFieldVisibility(saleType);

  useEffect(() => {
    if (saleType === "instore") {
      form.setFieldValue("marketplace", "");
      form.setFieldValue("orderId", "");
      return;
    }

    form.setFieldValue("storeLocation", "");
  }, [form, saleType]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isReadOnly) {
          void form.handleSubmit();
        }
      }}
    >
      <FormFrame
        title={mode === "create" ? "Create Sale" : mode === "read" ? "Read Sale" : "Edit Sale"}
        recordId={record?.saleId}
        updatedAt={record?.updatedAt}
        updatedBy={record?.updatedBy}
        footer={
          <div className="flex gap-3">
            <button className="rounded-full border px-4 py-2 text-sm font-semibold" onClick={() => {
              form.setFieldValue("bookId", sampleImportedSale.bookId);
              form.setFieldValue("reviewerId", sampleImportedSale.reviewerId);
              form.setFieldValue("channelId", sampleImportedSale.channelId);
              form.setFieldValue("saleType", sampleImportedSale.saleType);
              setSaleType(sampleImportedSale.saleType);
              form.setFieldValue("quantity", sampleImportedSale.quantity);
              form.setFieldValue("totalAmount", sampleImportedSale.totalAmount);
              form.setFieldValue("saleDate", sampleImportedSale.saleDate);
              form.setFieldValue("marketplace", sampleImportedSale.marketplace ?? "");
              form.setFieldValue("orderId", sampleImportedSale.orderId ?? "");
              form.setFieldValue("storeLocation", sampleImportedSale.storeLocation ?? "");
              onImportObject?.();
            }} type="button">
              Import Sale Object
            </button>
            {mode !== "read" ? (
              <button className="rounded-full bg-teal-700 px-5 py-2 font-semibold text-white transition hover:opacity-90" type="submit">
                {mode === "create" ? "Create sale" : "Save sale"}
              </button>
            ) : null}
          </div>
        }
      >
        {record ? (
          <div className="md:col-span-2 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-500">Created By</div>
              <div className="mt-2 text-sm">{record.createdBy}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-500">Created At</div>
              <div className="mt-2 text-sm">{record.createdAt}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-500">Last Modified By</div>
              <div className="mt-2 text-sm">{record.updatedBy}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-500">Last Modified At</div>
              <div className="mt-2 text-sm">{record.updatedAt}</div>
            </div>
          </div>
        ) : null}

        <form.Field name="bookId">
          {(field) => <FormSelectField disabled={isReadOnly} field={field} label="Book" options={salesBookOptions} />}
        </form.Field>

        <form.Field name="reviewerId">
          {(field) => <FormSelectField disabled={isReadOnly} field={field} label="Reviewer" options={salesReviewerOptions} />}
        </form.Field>

        <form.Field name="channelId">
          {(field) => <FormSelectField disabled={isReadOnly} field={field} label="Channel" options={salesChannelOptions} />}
        </form.Field>

        <form.Field name="saleType">
          {(field) => (
            <FormSelectField
              disabled={isReadOnly}
              field={field}
              label="Sale Type"
              onValueChange={(value) => setSaleType(value)}
              options={saleTypeOptions}
            />
          )}
        </form.Field>

        <form.Field name="quantity">
          {(field) => <FormTextField disabled={isReadOnly} field={field} label="Quantity" parseValue={(value) => Number(value)} />}
        </form.Field>

        <form.Field name="totalAmount">
          {(field) => <FormTextField disabled={isReadOnly} field={field} label="Total Amount" parseValue={(value) => Number(value)} />}
        </form.Field>

        <form.Field name="saleDate">
          {(field) => <FormTextField disabled={isReadOnly} field={field} label="Sale Date" />}
        </form.Field>

        <div className="md:col-span-2 grid gap-4 md:grid-cols-3" style={{ alignContent: "start", minHeight: "8.5rem" }}>
          {visibleFields.showStoreLocation ? (
            <form.Field name="storeLocation">
              {(field) => <FormTextField disabled={isReadOnly} field={field} label="Store Location" error={submitError ?? undefined} />}
            </form.Field>
          ) : (
            conditionalFieldPlaceholder
          )}

          {visibleFields.showMarketplace ? (
            <form.Field name="marketplace">
              {(field) => <FormTextField disabled={isReadOnly} field={field} label="Marketplace" error={submitError ?? undefined} />}
            </form.Field>
          ) : (
            conditionalFieldPlaceholder
          )}

          {visibleFields.showOrderId ? (
            <form.Field name="orderId">
              {(field) => <FormTextField disabled={isReadOnly} field={field} label="Order ID" error={submitError ?? undefined} />}
            </form.Field>
          ) : (
            conditionalFieldPlaceholder
          )}
        </div>
      </FormFrame>
    </form>
  );
};
