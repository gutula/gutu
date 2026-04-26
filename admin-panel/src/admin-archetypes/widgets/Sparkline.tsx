import * as React from "react";
import { cn } from "@/lib/cn";
import type { DriftPoint } from "../types";

export interface SparklineProps {
  data: readonly DriftPoint[];
  width?: number;
  height?: number;
  /** Stroke colour token; default uses currentColor. */
  stroke?: string;
  /** Fill area below line. */
  fill?: string;
  /** Plain-text description for screen readers. */
  description?: string;
  className?: string;
}

/** Tiny inline trend chart. SVG-based — zero dependencies. */
export function Sparkline({
  data,
  width = 64,
  height = 18,
  stroke = "currentColor",
  fill,
  description,
  className,
}: SparklineProps) {
  const path = React.useMemo(() => buildPath(data, width, height), [data, width, height]);
  if (data.length < 2) {
    return (
      <div
        aria-label={description}
        className={cn("inline-block text-text-muted", className)}
        style={{ width, height }}
      />
    );
  }
  return (
    <svg
      role="img"
      aria-label={description}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block overflow-visible", className)}
    >
      {fill && <path d={path.area} fill={fill} stroke="none" opacity={0.25} />}
      <path d={path.line} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

function buildPath(
  data: readonly DriftPoint[],
  width: number,
  height: number,
): { line: string; area: string } {
  if (data.length === 0) return { line: "", area: "" };
  const ys = data.map((p) => p.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const range = max - min || 1;
  const stepX = data.length === 1 ? 0 : width / (data.length - 1);
  const points = data.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p.y - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });
  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width.toFixed(1)},${height} L0,${height} Z`;
  return { line, area };
}
