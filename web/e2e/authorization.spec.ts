import { expect, test } from "@playwright/test";
import { loginAs } from "./helpers";

test("concurrent login failures cannot bypass the throttle with forwarded IP headers", async ({ page }) => {
  await page.goto("/");
  const origin = new URL(page.url()).origin;
  const username = `missing-${Date.now().toString(36)}`;
  const responses = await Promise.all(Array.from({ length: 8 }, (_, i) => page.request.post("/api/v1/session/login", {
    headers: { Origin: origin, "X-Forwarded-For": `192.0.2.${i + 1}` },
    data: { username, password: "Wrong-test-password-123" },
  })));
  const statuses = responses.map(response => response.status());
  expect(statuses.filter(status => status === 400)).toHaveLength(5);
  expect(statuses.filter(status => status === 429)).toHaveLength(3);
});

test("role doors, program detail and server authorization", async ({ page }) => {
  await page.goto("/enter");
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  for (const door of ["sponsor", "recipient", "verifier", "administrator"]) {
    await expect(page.locator(`a[href="/login/${door}"]`)).toBeVisible();
  }
  await loginAs(page, "sponsor", "demo-sponsor");
  const awardHref = await page.locator('a[href^="/awards/"]').first().getAttribute("href");
  const origin = new URL(page.url()).origin;
  const awardId = new URL(awardHref!, origin).pathname.split("/").pop()!;
  expect(awardId).toMatch(/^[0-9a-f-]+$/i);
  const bypass = await page.request.post(`/api/v1/awards/${awardId}/evidence/finalize`, {
    headers: { Origin: origin }, data: { reservation_id: crypto.randomUUID(), skip_storage: true, filenames: ["proof.jpg"] },
  });
  expect(bypass.status()).toBe(400);
  const missingOrigin = await page.request.post(`/api/v1/awards/${awardId}/prepare/PAY`, {
    data: { params: {}, expected_version: "0" }, headers: { "Idempotency-Key": crypto.randomUUID() },
  });
  expect(missingOrigin.status()).toBe(403);
  const wrongOrigin = await page.request.post(`/api/v1/awards/${awardId}/prepare/PAY`, {
    data: { params: {}, expected_version: "0" }, headers: { Origin: "https://attacker.test", "Idempotency-Key": crypto.randomUUID() },
  });
  expect(wrongOrigin.status()).toBe(403);
  const forbidden = await page.request.get("/admin");
  expect(forbidden.url()).toMatch(/\/forbidden/);

  await loginAs(page, "recipient", "demo-recipient-09");
  const payment = await page.request.post(`/api/v1/awards/${awardId}/prepare/PAY`, {
    data: { params: {}, expected_version: "0" }, headers: { Origin: origin, "Idempotency-Key": crypto.randomUUID() },
  });
  expect([403, 404]).toContain(payment.status());
});

test("staff-only account has no award or evidence authority", async ({ page }) => {
  await loginAs(page, "administrator", "demo-admin");
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrator workspace" })).toBeVisible();
  const unaffiliated = await page.request.get(`/api/v1/evidence/${crypto.randomUUID()}/download`);
  expect(unaffiliated.status()).toBe(404);
});
