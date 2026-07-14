import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getVerifiedClaims } from "@/features/auth/server/session";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Snippet Vault password.",
};
export default async function ResetPasswordPage() {
  if (!(await getVerifiedClaims())) redirect("/forgot-password");
  return <AuthForm mode="reset" />;
}
