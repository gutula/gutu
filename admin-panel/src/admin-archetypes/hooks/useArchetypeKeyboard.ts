import * as React from "react";
import { comboMatches, isEditableTarget } from "./_keyMatcher";

export interface ShortcutBinding {
  /** Human-readable label, e.g. "Refresh". */
  label: string;
  /** Key combo string. Single key like "r"; combos like "cmd+k", "shift+/". */
  combo: string;
  /** Handler. Returning false re-allows default (e.g. typing into an input). */
  run: (e: KeyboardEvent) => boolean | void;
  /** When false, the shortcut is suppressed in editable elements (default true). */
  ignoreInEditable?: boolean;
  /** Section label for the help overlay. */
  group?: string;
}

/** Bind a list of shortcuts to the page. Returns the same list back so
 *  callers can pass it to a help overlay. */
export function useArchetypeKeyboard(
  bindings: readonly ShortcutBinding[],
  options: { enabled?: boolean } = {},
): readonly ShortcutBinding[] {
  const enabled = options.enabled ?? true;
  const ref = React.useRef(bindings);
  ref.current = bindings;

  React.useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      for (const b of ref.current) {
        const ignoreEditable = b.ignoreInEditable ?? true;
        if (ignoreEditable && isEditableTarget(e.target)) continue;
        if (comboMatches(b.combo, e)) {
          const result = b.run(e);
          if (result !== false) {
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);

  return bindings;
}
