import { test, expect } from "@playwright/test";

test("auth flow placeholder", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await expect(page.getByTestId("sign-in-form")).toBeVisible();
});
