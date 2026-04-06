import Link from "next/link";
import { ResourceCard, cardActionClassName } from "our-lib";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import { initialDropBoxLocations } from "@/drop-box-locations/data/dropBoxLocationRepository";

export const DropBoxLocationsLibraryPage = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Generated Layout Stress Test
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Drop box locations use a generated card and form layout.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          This feature is meant to prove a lower-effort path: after Drizzle and Zod schemas exist, a developer mostly defines a typed resource profile.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href="/drop-box-locations/new">
            Create Location
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        {initialDropBoxLocations.map((record) => (
          <ResourceCard
            key={record.locationId}
            actions={
              <Link className={cardActionClassName} href={`/drop-box-locations/${record.locationId}`}>
                Open Form
              </Link>
            }
            profile={dropBoxLocationProfile}
            record={record}
          />
        ))}
      </section>
    </main>
  );
};
