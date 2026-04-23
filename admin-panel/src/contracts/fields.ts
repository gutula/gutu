import type { ReactNode } from "react";

/** FieldDescriptor — one entry in a form or list column set.
 *  Kept narrow and declarative so plugins can target it with `define…`.         */
export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "email"
  | "url"
  | "phone"
  | "boolean"
  | "date"
  | "datetime"
  | "enum"
  | "multi-enum"
  | "reference"
  | "json"
  | "custom";

export interface EnumOption {
  readonly value: string;
  readonly label: string;
  readonly intent?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}

export interface FieldDescriptor {
  /** Field name on the record. */
  readonly name: string;
  /** Display label. Falls back to titlecased name. */
  readonly label?: string;
  readonly kind: FieldKind;
  readonly required?: boolean;
  readonly readonly?: boolean;
  readonly placeholder?: string;
  readonly help?: string;
  readonly options?: readonly EnumOption[];
  /** For "reference" — the resource id to resolve the display value from. */
  readonly referenceTo?: string;
  /** For "currency" — default ISO-4217 code. */
  readonly currency?: string;
  /** For custom fields — render callback (receives value + change handler). */
  readonly render?: (ctx: FieldRenderContext) => ReactNode;
  /** Client-side validator — returns an error string or null. */
  readonly validate?: (value: unknown, record: Record<string, unknown>) => string | null;
  /** Hide from forms but keep in list views (e.g. computed read-only fields). */
  readonly formHidden?: boolean;
  readonly listHidden?: boolean;
}

export interface FieldRenderContext {
  value: unknown;
  record: Record<string, unknown>;
  onChange: (next: unknown) => void;
  disabled?: boolean;
  invalid?: boolean;
}
