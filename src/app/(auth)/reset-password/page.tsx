import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Snippet Vault password.",
};
export default function ResetPasswordPage() {
  return <AuthForm mode="reset" />;
}
