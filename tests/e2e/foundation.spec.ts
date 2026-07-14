import { expect, test } from "@playwright/test";

test("landing page and health endpoint are available", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /your reusable code/i }),
  ).toBeVisible();
  const health = await request.get("/api/health");
  await expect(health.json()).resolves.toEqual({ status: "ok" });
});

test("protected dashboard redirects to a mobile-friendly sign-in", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("signup shows a responsive strong-password meter", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/sign-up");

  const password = page.getByRole("textbox", {
    name: "Password",
    exact: true,
  });
  const meter = page.getByRole("progressbar", { name: /password strength/i });

  await password.fill("password");
  await expect(meter).toHaveAttribute("value", "1");
  await expect(page.getByText("Weak", { exact: true })).toBeVisible();

  await password.fill("CorrectHorse123!");
  await expect(meter).toHaveAttribute("value", "5");
  await expect(page.getByText("Strong", { exact: true })).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
