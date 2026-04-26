import * as React from "react";
import { Rows2, Rows3, Rows4 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDensity } from "../hooks/useDensity";
import type { Density } from "../types";

export interface DensityToggleProps {
  /** When provided, overrides the user-pref density. */
  value?: Density;
  onChange?: (next: Density) => void;
  className?: string;
}

const ORDER: Density[] = ["comfortable", "cozy", "compact"];
type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ICON: Record<Density, IconCmp> = {
  comfortable: Rows2 as unknown as IconCmp,
  cozy: Rows3 as unknown as IconCmp,
  compact: Rows4 as unknown as IconCmp,
};

export function DensityToggle({ value, onChange, className }: DensityToggleProps) {
  const [stored, setStored] = useDensity();
  const current = value ?? stored;
  const set = (next: Density) => {
    if (onChange) onChange(next);
    else setStored(next);
  };
  return (
    <div
      role="radiogroup"
      aria-label="Density"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-1 p-0.5",
        className,
      )}
    >
      {ORDER.map((d) => {
        const Icon = ICON[d];
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={d === current}
            aria-label={d}
            onClick={() => set(d)}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded text-text-muted",
              d === current && "bg-surface-raised text-text-primary",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
