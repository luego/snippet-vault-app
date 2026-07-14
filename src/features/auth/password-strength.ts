export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "12+ characters",
    message: "Use at least 12 characters",
    test: (value: string) => value.length >= 12,
  },
  {
    id: "lowercase",
    label: "Lowercase letter",
    message: "Add a lowercase letter",
    test: (value: string) => /[a-z]/u.test(value),
  },
  {
    id: "uppercase",
    label: "Uppercase letter",
    message: "Add an uppercase letter",
    test: (value: string) => /[A-Z]/u.test(value),
  },
  {
    id: "number",
    label: "Number",
    message: "Add a number",
    test: (value: string) => /[0-9]/u.test(value),
  },
  {
    id: "symbol",
    label: "Symbol",
    message: "Add a symbol",
    test: (value: string) => /[^A-Za-z0-9\s]/u.test(value),
  },
] as const;

export function evaluatePasswordStrength(value: string) {
  const requirements = PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    met: requirement.test(value),
  }));
  const score = requirements.filter((requirement) => requirement.met).length;
  const label =
    value.length === 0
      ? "Enter a password"
      : score <= 2
        ? "Weak"
        : score === 3
          ? "Fair"
          : score === 4
            ? "Good"
            : "Strong";

  return { score, label, requirements };
}
