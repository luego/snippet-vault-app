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
