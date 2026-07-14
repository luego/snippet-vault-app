import Link from "next/link";

type AuthMode = "sign-in" | "sign-up" | "forgot" | "reset";

const content: Record<
  AuthMode,
  { title: string; description: string; submit: string }
> = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to open your personal code library.",
    submit: "Sign in",
  },
  "sign-up": {
    title: "Create your vault",
    description: "Start organizing the code you want to reuse.",
    submit: "Create account",
  },
  forgot: {
    title: "Reset your password",
    description: "Enter your email and we’ll send you a secure reset link.",
    submit: "Send reset link",
  },
  reset: {
    title: "Choose a new password",
    description: "Use a strong password you do not use elsewhere.",
    submit: "Update password",
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = content[mode];
  const showName = mode === "sign-up";
  const showEmail = mode !== "reset";
  const showPassword =
    mode === "sign-in" || mode === "sign-up" || mode === "reset";

  return (
    <div className="auth-card">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      <form className="auth-form">
        {showName && (
          <div className="field">
            <label htmlFor="display-name">Display name</label>
            <input
              id="display-name"
              name="displayName"
              autoComplete="name"
              placeholder="Alex Morgan"
              maxLength={80}
            />
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
            />
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
              required
            />
          </div>
        )}
        {mode === "sign-in" && (
          <div className="form-row">
            <label>
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <Link href="/forgot-password" className="text-link">
              Forgot password?
            </Link>
          </div>
        )}
        <button className="button button-primary" type="submit">
          {copy.submit}
        </button>
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
