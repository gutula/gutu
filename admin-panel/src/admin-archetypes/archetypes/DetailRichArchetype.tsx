import * as React from "react";
import {
  RichDetailPage,
  type RichDetailPageProps,
} from "@/admin-primitives/RichDetailPage";

/** Archetype #12 — Detail-Rich Page. Wraps the existing `RichDetailPage`
 *  primitive so plugins can adopt the design system without losing the
 *  detail-page features they already have. */
export function DetailRichArchetype(props: RichDetailPageProps) {
  return <RichDetailPage {...props} />;
}

export type { RichDetailPageProps };
