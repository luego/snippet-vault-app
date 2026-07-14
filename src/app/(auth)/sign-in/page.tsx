import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Snippet Vault.",
};
export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
