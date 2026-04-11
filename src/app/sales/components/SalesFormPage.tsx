"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormPageShell } from "our-lib";
import { SalesForm } from "@/sales/components/SalesForm";
import { salesDemoStore, useSalesDemoStore } from "@/sales/services/salesDemoStore";
import type { SaleInput, SaleRecord, SaleRevision } from "@/sales/models/schemas";
import { finalizePopupMutation } from "@/config/recordMutations";

type SalesFormPageProps = {
  mode: "create" | "edit";
  saleId?: string;
};

const emptySale: SaleInput = {
  bookId: "sb-01",
  reviewerId: "rv-01",
  channelId: "ch-01",
  saleType: "online",
  quantity: 1,
  totalAmount: 0,
  saleDate: "2026-03-30",
  marketplace: "",
  orderId: "",
  storeLocation: "",
};

const toSaleInput = (record?: SaleRecord): SaleInput => {
  return {
    bookId: record?.bookId ?? emptySale.bookId,
    reviewerId: record?.reviewerId ?? emptySale.reviewerId,
    channelId: record?.channelId ?? emptySale.channelId,
    saleType: record?.saleType ?? emptySale.saleType,
    quantity: record?.quantity ?? emptySale.quantity,
    totalAmount: record?.totalAmount ?? emptySale.totalAmount,
    saleDate: record?.saleDate ?? emptySale.saleDate,
    marketplace: record?.marketplace ?? "",
    orderId: record?.orderId ?? "",
    storeLocation: record?.storeLocation ?? "",
  };
};

const demoBatchImport: SaleInput[] = [
  {
    bookId: "sb-04",
    reviewerId: "rv-01",
    channelId: "ch-04",
    saleType: "online",
    quantity: 2,
    totalAmount: 49.98,
    saleDate: "2026-03-22",
    marketplace: "Marketplace Hub",
    orderId: "XLS-5001",
    storeLocation: "",
  },
  {
    bookId: "sb-03",
    reviewerId: "rv-02",
    channelId: "ch-02",
    saleType: "instore",
    quantity: 3,
    totalAmount: 74.97,
    saleDate: "2026-03-23",
    storeLocation: "Downtown",
    marketplace: "",
    orderId: "",
  },
];

export const SalesFormPage = ({ mode, saleId }: SalesFormPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sales } = useSalesDemoStore();
  const [currentMode, setCurrentMode] = useState<"create" | "edit" | "read">(mode === "create" ? "create" : "read");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<SaleRevision[]>([]);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const returnTo = searchParams.get("returnTo") ?? "/sales";

  const navigateBackToList = () => {
    router.push(returnTo);
  };

  const currentRecord = useMemo(() => {
    return sales.find((item) => item.saleId === saleId);
  }, [saleId, sales]);

  useEffect(() => {
    if (!saleId) {
      setRevisions([]);
      return;
    }
    void salesDemoStore.listRevisions(saleId).then(setRevisions);
  }, [saleId, sales]);

  return (
    <FormPageShell
      backHref="/sales"
      backLabel="Back to sales cards"
      title={
        currentMode === "create"
          ? "Create a new sale"
          : currentMode === "read"
            ? `Read ${currentRecord?.saleId ?? "sale"}`
            : `Edit ${currentRecord?.saleId ?? "sale"}`
      }
      description="This form supports create, edit, read-only, delete, import, revisions, and conditional sale-type rules."
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
      statusMessage={statusMessage}
    >
      <div className="flex flex-wrap gap-3">
        {currentMode !== "create" ? (
          <>
            <button className="rounded-full border px-4 py-2 text-sm font-semibold" onClick={() => setCurrentMode("read")} type="button">
              Read Only
            </button>
            <button className="rounded-full border px-4 py-2 text-sm font-semibold" onClick={() => setCurrentMode("edit")} type="button">
              Edit
            </button>
          </>
        ) : null}
        {currentMode === "create" ? (
          <button
            className="rounded-full border px-4 py-2 text-sm font-semibold"
            onClick={() =>
              void salesDemoStore.importBatch(demoBatchImport).then((created) => {
                setStatusMessage(`Imported ${created.length} sales from fake Excel data.`);
              })
            }
            type="button"
          >
            Excel Import
          </button>
        ) : null}
      </div>

      <SalesForm
        initialValue={toSaleInput(currentRecord)}
        mode={currentMode}
        onImportObject={() => setStatusMessage("Imported a sample sale object into the form.")}
        onSubmit={async (value) => {
          if (currentMode === "create") {
            const created = await salesDemoStore.create(value);
            setStatusMessage(`Created ${created.saleId}.`);
            finalizePopupMutation({
              entity: "sale",
              mutation: "create",
              record: created,
            });
            navigateBackToList();
            return;
          }

          if (!saleId) {
            return;
          }

          const updated = await salesDemoStore.update(saleId, value);
          setStatusMessage(`Saved changes for ${updated.saleId}.`);
          finalizePopupMutation({
            entity: "sale",
            mutation: "update",
            record: updated,
          });
          navigateBackToList();
        }}
        record={currentRecord}
      />

      {saleId ? (
        <section className="rounded-3xl border bg-white/70 p-6">
          <h2 className="text-2xl font-semibold">Revision History</h2>
          <div className="mt-4 space-y-3">
            {revisions.length === 0 ? <p className="text-sm text-stone-600">No revisions yet.</p> : null}
            {revisions.map((revision) => (
              <div className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between" key={revision.revisionId}>
                <div>
                  <div className="font-semibold">{revision.action.toUpperCase()}</div>
                  <div className="text-sm text-stone-600">
                    {revision.changedBy} on {revision.changedAt}
                  </div>
                </div>
                <button
                  className="rounded-full border px-4 py-2 text-sm font-semibold"
                  onClick={() =>
                    void salesDemoStore.restoreRevision(saleId, revision.revisionId).then(async (restored) => {
                      setStatusMessage(`Restored ${restored.saleId} from revision ${revision.revisionId}.`);
                      setRevisions(await salesDemoStore.listRevisions(saleId));
                    })
                  }
                  type="button"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {saleId ? (
        <section className="rounded-3xl border bg-white/70 p-6">
          <h2 className="text-2xl font-semibold">Hard Delete</h2>
          <p className="mt-3 text-sm text-stone-600">Deleting a sale requires confirmation and a reason. If this is the reviewer&apos;s last sale, the reviewer is also removed.</p>
          <div className="mt-4 flex flex-col gap-3">
            <textarea className="min-h-24 rounded-2xl border px-4 py-3" onChange={(event) => setDeleteReason(event.target.value)} placeholder="Delete reason" value={deleteReason} />
            {!showDeleteConfirm ? (
              <button className="rounded-full border px-4 py-2 text-sm font-semibold" onClick={() => setShowDeleteConfirm(true)} type="button">
                Delete Sale
              </button>
            ) : (
              <button
                className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() =>
                  void salesDemoStore.delete(saleId, deleteReason).then((result) => {
                    setStatusMessage(
                      result.deletedReviewerId
                        ? `Deleted ${result.deletedSaleId} and reviewer ${result.deletedReviewerId} because it was the last sale.`
                        : `Deleted ${result.deletedSaleId}.`,
                    );
                    finalizePopupMutation({
                      entity: "sale",
                      mutation: "delete",
                      recordId: result.deletedSaleId,
                    });
                    setShowDeleteConfirm(false);
                    navigateBackToList();
                  })
                }
                type="button"
              >
                Confirm Hard Delete
              </button>
            )}
          </div>
        </section>
      ) : null}
    </FormPageShell>
  );
};
