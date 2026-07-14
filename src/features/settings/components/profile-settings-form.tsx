"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateProfile } from "@/features/settings/actions/settings";
import { initialSettingsActionState } from "@/features/settings/types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save profile"}
    </button>
  );
}

export function ProfileSettingsForm({
  email,
  displayName,
  avatarUrl,
}: {
  email: string;
  displayName: string;
  avatarUrl: string;
}) {
  const [state, action] = useActionState(
    updateProfile,
    initialSettingsActionState,
  );

  return (
    <form className="settings-form" action={action} noValidate>
      <div className="field">
        <label htmlFor="profile-email">Email address</label>
        <input id="profile-email" value={email} disabled readOnly />
        <span className="field-help">
          Managed through your Supabase account.
        </span>
      </div>
      <div className="field">
        <label htmlFor="profile-display-name">Display name</label>
        <input
          id="profile-display-name"
          name="displayName"
          defaultValue={displayName}
          maxLength={80}
          autoComplete="name"
          aria-describedby={
            state.fieldErrors?.displayName ? "displayName-error" : undefined
          }
        />
        {state.fieldErrors?.displayName && (
          <span className="field-error" id="displayName-error">
            {state.fieldErrors.displayName[0]}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="profile-avatar-url">Avatar URL</label>
        <input
          id="profile-avatar-url"
          name="avatarUrl"
          type="url"
          inputMode="url"
          defaultValue={avatarUrl}
          placeholder="https://example.com/avatar.jpg"
          aria-describedby={
            state.fieldErrors?.avatarUrl ? "avatarUrl-error" : "avatar-url-help"
          }
        />
        <span className="field-help" id="avatar-url-help">
          Optional. HTTPS URLs only; uploads are not enabled.
        </span>
        {state.fieldErrors?.avatarUrl && (
          <span className="field-error" id="avatarUrl-error">
            {state.fieldErrors.avatarUrl[0]}
          </span>
        )}
      </div>
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
