import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a Snippet Vault password reset.",
};
export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
