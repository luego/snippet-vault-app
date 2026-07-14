import { Check, Circle } from "lucide-react";

import { evaluatePasswordStrength } from "@/features/auth/password-strength";

export function PasswordStrength({ password }: { password: string }) {
  const strength = evaluatePasswordStrength(password);

  return (
    <div
      className="password-strength"
      data-score={strength.score}
      id="password-strength"
    >
      <div className="password-strength-heading">
        <span>Password strength</span>
        <strong>{strength.label}</strong>
      </div>
      <progress
        aria-label={`Password strength: ${strength.label}`}
        value={strength.score}
        max={5}
      >
        {strength.score} of 5 requirements
      </progress>
      <ul aria-label="Strong password requirements">
        {strength.requirements.map((requirement) => (
          <li data-met={requirement.met} key={requirement.id}>
            {requirement.met ? (
              <Check aria-hidden="true" className="size-3.5" />
            ) : (
              <Circle aria-hidden="true" className="size-3.5" />
            )}
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
