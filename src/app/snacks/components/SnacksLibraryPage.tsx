import Link from "next/link";
import { ResourceCard, cardActionClassName } from "our-lib";
import { initialSnacks } from "@/snacks/data/snackSeedData";
import { snackResource } from "@/snacks/models/resource";

export const SnacksLibraryPage = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Resource Builder Demo
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Snacks are driven by a single reusable resource definition.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          The snack feature keeps its wiring small by letting one builder object own the generated card profile, form profile,
          service template, and default input mapping.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href="/snacks/new">
            Create Snack
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        {initialSnacks.map((record) => (
          <ResourceCard
            key={record.snackId}
            actions={
              <Link className={cardActionClassName} href={`/snacks/${record.snackId}`}>
                Open Form
              </Link>
            }
            profile={snackResource.profile}
            record={record}
          />
        ))}
      </section>
    </main>
  );
};
