import * as React from "react";
import type { DashboardView as DashboardViewDef } from "@/contracts/views";
import { PageHeader } from "@/admin-primitives/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin-primitives/Card";
import { cn } from "@/lib/cn";

export function DashboardViewRenderer({ view }: { view: DashboardViewDef }) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={view.title} description={view.description} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 auto-rows-[minmax(120px,auto)]">
        {view.widgets.map((w) => (
          <Card
            key={w.id}
            className={cn(
              w.size === "sm" && "col-span-1",
              w.size === "md" && "col-span-1 md:col-span-2",
              w.size === "lg" && "col-span-1 md:col-span-2 xl:col-span-3",
              w.size === "xl" && "col-span-1 md:col-span-2 xl:col-span-4",
              !w.size && "col-span-1",
            )}
          >
            {w.title && (
              <CardHeader>
                <CardTitle>{w.title}</CardTitle>
              </CardHeader>
            )}
            <CardContent>{w.render()}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
