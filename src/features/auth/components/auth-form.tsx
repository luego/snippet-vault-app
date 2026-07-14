"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  requestPasswordReset,
  resetPassword,
  signIn,
  signUp,
} from "@/features/auth/actions/auth";
import {
  initialAuthActionState,
  type AuthActionState,
} from "@/features/auth/types";

type AuthMode = "sign-in" | "sign-up" | "forgot" | "reset";

const content: Record<
  AuthMode,
  { title: string; description: string; submit: string; pending: string }
> = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to open your personal code library.",
    submit: "Sign in",
    pending: "Signing in…",
  },
  "sign-up": {
    title: "Create your vault",
    description: "Start organizing the code you want to reuse.",
    submit: "Create account",
    pending: "Creating account…",
  },
  forgot: {
    title: "Reset your password",
    description: "Enter your email and we’ll send you a secure reset link.",
    submit: "Send reset link",
    pending: "Sending link…",
  },
  reset: {
    title: "Choose a new password",
    description: "Use a strong password you do not use elsewhere.",
    submit: "Update password",
    pending: "Updating password…",
  },
};

const actions = {
  "sign-in": signIn,
  "sign-up": signUp,
  forgot: requestPasswordReset,
  reset: resetPassword,
} as const;

function FieldError({ state, name }: { state: AuthActionState; name: string }) {
  const messages = state.fieldErrors?.[name];
  if (!messages?.length) return null;
  return (
    <span className="field-error" id={`${name}-error`}>
      {messages[0]}
    </span>
  );
}

function SubmitButton({ idle, pending }: { idle: string; pending: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <button
      className="button button-primary"
      type="submit"
      disabled={isPending}
    >
      {isPending ? pending : idle}
    </button>
  );
}

export function AuthForm({
  mode,
  nextPath,
  notice,
  noticeStatus = "success",
}: {
  mode: AuthMode;
  nextPath?: string;
  notice?: string;
  noticeStatus?: "success" | "error";
}) {
  const copy = content[mode];
  const [state, formAction] = useActionState(
    actions[mode],
    initialAuthActionState,
  );
  const showName = mode === "sign-up";
  const showEmail = mode !== "reset";
  const showPassword =
    mode === "sign-in" || mode === "sign-up" || mode === "reset";
  const showConfirmation = mode === "sign-up" || mode === "reset";

  return (
    <div className="auth-card">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      {notice && (
        <div
          className={`form-message ${noticeStatus}`}
          role={noticeStatus === "error" ? "alert" : "status"}
        >
          {notice}
        </div>
      )}
      {state.message && (
        <div
          className={`form-message ${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      )}
      <form className="auth-form" action={formAction} noValidate>
        {mode === "sign-in" && (
          <input type="hidden" name="next" value={nextPath ?? ""} />
        )}
        {showName && (
          <div className="field">
            <label htmlFor="display-name">Display name</label>
            <input
              id="display-name"
              name="displayName"
              autoComplete="name"
              placeholder="Alex Morgan"
              maxLength={80}
              aria-describedby={
                state.fieldErrors?.displayName ? "displayName-error" : undefined
              }
            />
            <FieldError state={state} name="displayName" />
          </div>
        )}
        {showEmail && (
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              aria-describedby={
                state.fieldErrors?.email ? "email-error" : undefined
              }
            />
            <FieldError state={state} name="email" />
          </div>
        )}
        {showPassword && (
          <div className="field">
            <label htmlFor="password">
              {mode === "reset" ? "New password" : "Password"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              minLength={8}
              maxLength={72}
              required
              aria-describedby={
                state.fieldErrors?.password ? "password-error" : undefined
              }
            />
            <FieldError state={state} name="password" />
          </div>
        )}
        {showConfirmation && (
          <div className="field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              aria-describedby={
                state.fieldErrors?.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
            />
            <FieldError state={state} name="confirmPassword" />
          </div>
        )}
        {mode === "sign-in" && (
          <div className="form-row">
            <span>Secure cookie-based session</span>
            <Link href="/forgot-password" className="text-link">
              Forgot password?
            </Link>
          </div>
        )}
        <SubmitButton idle={copy.submit} pending={copy.pending} />
      </form>
      {mode === "sign-in" && (
        <p className="auth-footnote">
          New to Snippet Vault?{" "}
          <Link href="/sign-up" className="text-link">
            Create an account
          </Link>
        </p>
      )}
      {mode === "sign-up" && (
        <p className="auth-footnote">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>
        </p>
      )}
      {(mode === "forgot" || mode === "reset") && (
        <p className="auth-footnote">
          <Link href="/sign-in" className="text-link">
            Back to sign in
          </Link>
        </p>
      )}
    </div>
  );
}
