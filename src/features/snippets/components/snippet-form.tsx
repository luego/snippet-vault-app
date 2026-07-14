"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createSnippet,
  updateSnippet,
} from "@/features/snippets/actions/snippets";
import {
  initialSnippetActionState,
  type SnippetActionState,
  type SnippetDetail,
  type SnippetTag,
} from "@/features/snippets/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";

function FieldError({
  state,
  name,
}: {
  state: SnippetActionState;
  name: string;
}) {
  const message = state.fieldErrors?.[name]?.[0];
  return message ? (
    <span className="field-error" id={`${name}-error`}>
      {message}
    </span>
  ) : null;
}

function SaveButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? "Saving…" : editing ? "Save changes" : "Create snippet"}
    </button>
  );
}

export function SnippetForm({
  snippet,
  tags = [],
}: {
  snippet?: SnippetDetail;
  tags?: SnippetTag[];
}) {
  const editing = Boolean(snippet);
  const action = snippet ? updateSnippet.bind(null, snippet.id) : createSnippet;
  const [state, formAction] = useActionState(action, initialSnippetActionState);
  const cancelHref = snippet ? `/snippets/${snippet.id}` : "/snippets";

  return (
    <form className="snippet-editor" action={formAction} noValidate>
      {state.message && (
        <div className="form-message error" role="alert">
          {state.message}
        </div>
      )}

      <div className="snippet-form-grid">
        <div className="field">
          <label htmlFor="snippet-title">Title</label>
          <input
            id="snippet-title"
            name="title"
            defaultValue={snippet?.title}
            maxLength={120}
            required
            aria-describedby={
              state.fieldErrors?.title ? "title-error" : undefined
            }
          />
          <FieldError state={state} name="title" />
        </div>

        <div className="field">
          <label htmlFor="snippet-language">Language</label>
          <select
            id="snippet-language"
            name="language"
            defaultValue={snippet?.language ?? "plaintext"}
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError state={state} name="language" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="snippet-description">Description</label>
        <textarea
          id="snippet-description"
          name="description"
          defaultValue={snippet?.description ?? ""}
          maxLength={500}
          rows={3}
          placeholder="What does this snippet do?"
          aria-describedby={
            state.fieldErrors?.description ? "description-error" : undefined
          }
        />
        <FieldError state={state} name="description" />
      </div>

      <div className="field">
        <label htmlFor="snippet-code">Code</label>
        <textarea
          id="snippet-code"
          name="code"
          className="code-textarea"
          defaultValue={snippet?.code}
          maxLength={50_000}
          rows={20}
          spellCheck={false}
          required
          aria-describedby={state.fieldErrors?.code ? "code-error" : undefined}
        />
        <FieldError state={state} name="code" />
      </div>

      <div className="snippet-form-grid">
        <div className="field">
          <label htmlFor="snippet-tags">Tags</label>
          <input
            id="snippet-tags"
            name="tags"
            defaultValue={tags.map((tag) => tag.name).join(", ")}
            maxLength={320}
            placeholder="api, typescript, utility"
            aria-describedby="tags-help"
          />
          <span className="field-help" id="tags-help">
            Separate up to 10 tags with commas.
          </span>
          <FieldError state={state} name="tags" />
        </div>

        <fieldset className="visibility-field">
          <legend>Visibility</legend>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              defaultChecked={!snippet || snippet.visibility === "private"}
            />
            <span>
              <strong>Private</strong>
              Only you can access it
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              defaultChecked={snippet?.visibility === "public"}
            />
            <span>
              <strong>Public</strong>
              Ready for sharing in Milestone 5
            </span>
          </label>
        </fieldset>
      </div>

      <div className="snippet-form-actions">
        <Link href={cancelHref} className="button button-secondary">
          Cancel
        </Link>
        <SaveButton editing={editing} />
      </div>
    </form>
  );
}
