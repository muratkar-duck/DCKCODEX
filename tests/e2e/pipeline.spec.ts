import { test, expect } from "@playwright/test";

test("pipeline walkthrough", async ({ page }) => {
  await page.goto("/test/pipeline");
  const steps = await page.getByTestId("pipeline-steps").locator("[data-test-id^=pipeline-step]");
  await expect(steps).toHaveCount(5);
  await expect(steps.first()).toContainText("Senaryo oluştur");
});
