import * as React from "react";
import { z } from "zod";
import type { FormView as FormViewDef } from "@/contracts/views";
import type { FieldDescriptor } from "@/contracts/fields";
import { PageHeader } from "@/admin-primitives/PageHeader";
import { FormField } from "@/admin-primitives/FormField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/admin-primitives/Card";
import { ErrorState } from "@/admin-primitives/ErrorState";
import { Button } from "@/primitives/Button";
import { useRuntime } from "@/runtime/context";
import { useRecord } from "@/runtime/hooks";
import { FieldInput } from "./FieldInput";
import { navigateTo } from "./useRoute";
import { cn } from "@/lib/cn";

export interface FormViewRendererProps {
  view: FormViewDef;
  /** Record id when editing; undefined when creating. */
  id?: string;
  /** Where to return after save/cancel. */
  returnPath: string;
  basePath: string;
}

export function FormViewRenderer({
  view,
  id,
  returnPath,
  basePath,
}: FormViewRendererProps) {
  const runtime = useRuntime();
  const { data: existing, loading, error } = useRecord(view.resource, id);
  const [values, setValues] = React.useState<Record<string, unknown>>(
    view.defaults ?? {},
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (existing) {
      setValues(existing);
      setDirty(false);
    } else if (!id) {
      setValues(view.defaults ?? {});
    }
  }, [existing, id, view.defaults]);

  if (error)
    return (
      <ErrorState
        error={error}
        title="Record failed to load"
        onRetry={() => runtime.resources.refresh(view.resource)}
      />
    );

  const setField = (name: string, value: unknown) => {
    setDirty(true);
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (evt?: React.FormEvent) => {
    evt?.preventDefault();
    const { ok, errors: errs, cleaned } = validateForm(view, values);
    setErrors(errs);
    if (!ok) {
      runtime.actions.toast({
        title: "Please fix the highlighted fields",
        intent: "danger",
      });
      return;
    }
    setSubmitting(true);
    try {
      if (id) {
        await runtime.resources.update(view.resource, id, cleaned);
        runtime.actions.toast({
          title: "Saved",
          description: "Record updated successfully.",
          intent: "success",
        });
      } else {
        const created = await runtime.resources.create(view.resource, cleaned);
        runtime.actions.toast({
          title: "Created",
          description: "Record created successfully.",
          intent: "success",
        });
        navigateTo(`${basePath}/${String(created.id)}`);
        return;
      }
      navigateTo(returnPath);
    } catch (err) {
      runtime.actions.toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unknown error.",
        intent: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <PageHeader
        title={id ? view.title : `New ${view.title}`}
        description={view.description}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigateTo(returnPath)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={!dirty && !!id}
            >
              {id ? "Save changes" : "Create"}
            </Button>
          </>
        }
      />

      {view.sections.map((section) => (
        <Card key={section.id}>
          {(section.title || section.description) && (
            <CardHeader>
              <div>
                {section.title && <CardTitle>{section.title}</CardTitle>}
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </div>
            </CardHeader>
          )}
          <CardContent>
            <div
              className={cn(
                "grid gap-4",
                section.columns === 3
                  ? "grid-cols-1 md:grid-cols-3"
                  : section.columns === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1",
              )}
            >
              {section.fields
                .filter((f) => !f.formHidden)
                .map((f) => (
                  <FormField
                    key={f.name}
                    label={f.label ?? humanize(f.name)}
                    required={f.required}
                    help={f.help}
                    error={errors[f.name]}
                  >
                    <FieldInput
                      field={f}
                      value={values[f.name]}
                      onChange={(v) => setField(f.name, v)}
                      record={values}
                      invalid={!!errors[f.name]}
                      disabled={loading && !!id}
                    />
                  </FormField>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </form>
  );
}

function validateForm(
  view: FormViewDef,
  values: Record<string, unknown>,
): {
  ok: boolean;
  errors: Record<string, string>;
  cleaned: Record<string, unknown>;
} {
  const errors: Record<string, string> = {};
  const cleaned: Record<string, unknown> = { ...values };

  for (const section of view.sections) {
    for (const f of section.fields) {
      if (f.formHidden) continue;
      const raw = values[f.name];
      if (f.required && (raw === undefined || raw === null || raw === "")) {
        errors[f.name] = `${f.label ?? humanize(f.name)} is required`;
        continue;
      }
      if (f.validate && raw !== undefined) {
        const v = f.validate(raw, values);
        if (v) {
          errors[f.name] = v;
          continue;
        }
      }
      if (f.kind === "email" && typeof raw === "string" && raw) {
        if (!z.string().email().safeParse(raw).success) {
          errors[f.name] = "Enter a valid email";
        }
      }
      if (f.kind === "url" && typeof raw === "string" && raw) {
        if (!z.string().url().safeParse(raw).success) {
          errors[f.name] = "Enter a valid URL";
        }
      }
      if (f.kind === "json" && typeof raw === "string" && raw.trim() !== "") {
        try {
          cleaned[f.name] = JSON.parse(raw);
        } catch {
          errors[f.name] = "Invalid JSON";
        }
      }
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, cleaned };
}

function humanize(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}
