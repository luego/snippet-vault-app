import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { redirectIfAuthenticated } from "@/features/auth/server/session";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your personal Snippet Vault.",
};
export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return <AuthForm mode="sign-up" />;
}
