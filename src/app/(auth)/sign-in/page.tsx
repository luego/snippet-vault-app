import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { redirectIfAuthenticated } from "@/features/auth/server/session";
import { safeInternalRedirect } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Snippet Vault.",
};
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await redirectIfAuthenticated();
  const params = await searchParams;
  const nextValue = typeof params.next === "string" ? params.next : undefined;
  const hasCallbackError = params.error === "callback";
  const notice =
    params.reset === "success"
      ? "Your password was updated. Sign in with the new password."
      : hasCallbackError
        ? "That sign-in link is invalid or expired. Please try again."
        : undefined;
  return (
    <AuthForm
      mode="sign-in"
      nextPath={safeInternalRedirect(nextValue)}
      notice={notice}
      noticeStatus={hasCallbackError ? "error" : "success"}
    />
  );
}
