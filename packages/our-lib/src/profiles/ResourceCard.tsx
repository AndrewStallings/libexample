import type { ReactNode } from "react";
import { EntityCard, type EntityCardSection } from "../cards/EntityCard";
import type { ResourceProfile } from "./defineResourceProfile";

type ResourceCardProps<TRecord, TInput extends Record<string, unknown>> = {
  profile: ResourceProfile<TRecord, TInput>;
  record: TRecord;
  actions?: ReactNode;
};

export const ResourceCard = <TRecord, TInput extends Record<string, unknown>>({
  profile,
  record,
  actions,
}: ResourceCardProps<TRecord, TInput>) => {
  const sectionsByTitle = new Map<string, EntityCardSection>();

  for (const field of profile.cardFields) {
    const existingSection = sectionsByTitle.get(field.section);
    const item = {
      label: field.label,
      value: field.value(record),
      prominent: field.prominent,
    };

    if (existingSection) {
      existingSection.items.push(item);
      continue;
    }

    sectionsByTitle.set(field.section, {
      title: field.section,
      items: [item],
    });
  }

  return <EntityCard actions={actions} sections={[...sectionsByTitle.values()]} />;
};
