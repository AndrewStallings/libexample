export type EntityId = string | number;

export type IsoDateTimeLike = {
  toISO(): string | null;
};

export type UpdatedAtValue = string | Date | IsoDateTimeLike;

export type AuditStamp = {
  updatedAt: UpdatedAtValue;
  updatedBy: string;
};

export type SelectOption = {
  label: string;
  value: string;
};
