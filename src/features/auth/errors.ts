type AuthErrorDetails = {
  code?: string;
  status?: number;
};

export function signUpErrorMessage(error: AuthErrorDetails) {
  switch (error.code) {
    case "over_email_send_rate_limit":
      return "Too many confirmation emails have been sent. Wait before trying again or configure custom SMTP in Supabase.";
    case "over_request_rate_limit":
      return "Too many signup attempts. Wait a few minutes and try again.";
    case "email_address_not_authorized":
      return "This Supabase project cannot send to that address. Use a project member email or configure custom SMTP.";
    case "email_address_invalid":
      return "Use a deliverable email address. Test and example email domains are not accepted.";
    case "email_provider_disabled":
    case "provider_disabled":
      return "Email account creation is currently disabled in Supabase.";
  }

  if (error.status === 429) {
    return "Too many signup attempts. Wait a few minutes and try again.";
  }

  return "We could not create the account. Try again in a moment.";
}
