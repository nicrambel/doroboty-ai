import { test as base } from "@playwright/test";

export { expect, type Page } from "@playwright/test";

// Existing product journeys keep their no-external-requests contract. Analytics
// has a separate suite that intercepts and inspects the actual SDK payloads.
export const test = base.extend<{ analyticsPrivacy: void }>({
  analyticsPrivacy: [
    async ({ context }, use) => {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "doNotTrack", { configurable: true, get: () => "1" });
      });
      await use();
    },
    { auto: true },
  ],
});
