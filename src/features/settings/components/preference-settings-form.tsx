"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTheme } from "next-themes";

import { updatePreferences } from "@/features/settings/actions/settings";
import { initialSettingsActionState } from "@/features/settings/types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save preferences"}
    </button>
  );
}

const choices = [
  ["light", "Light", Sun],
  ["dark", "Dark", Moon],
  ["system", "System", Monitor],
] as const;

export function PreferenceSettingsForm({
  preferredTheme,
}: {
  preferredTheme: "light" | "dark" | "system";
}) {
  const [state, action] = useActionState(
    updatePreferences,
    initialSettingsActionState,
  );
  const { setTheme } = useTheme();

  return (
    <form className="settings-form" action={action}>
      <fieldset className="theme-choices">
        <legend>Color theme</legend>
        {choices.map(([value, label, Icon]) => (
          <label key={value}>
            <input
              type="radio"
              name="theme"
              value={value}
              defaultChecked={preferredTheme === value}
              onChange={() => setTheme(value)}
            />
            <span className="theme-choice-icon">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span>
              <strong>{label}</strong>
              <small>
                {value === "system"
                  ? "Follow your device setting"
                  : `Always use ${value} mode`}
              </small>
            </span>
          </label>
        ))}
      </fieldset>
      {state.message && (
        <div
          className={`form-message ${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      )}
      <div className="settings-form-actions">
        <SaveButton />
      </div>
    </form>
  );
}
