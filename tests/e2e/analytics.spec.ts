import { test, expect, type Page } from "@playwright/test";
import { gunzipSync } from "node:zlib";
import { loadEnv } from "vite";

const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const configured =
  env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?.startsWith("phc_") &&
  ["https://eu.i.posthog.com", "https://us.i.posthog.com"].includes(
    env.VITE_PUBLIC_POSTHOG_HOST ?? "",
  );
const secret = "PRIVATE_EMAIL_CV_RECRUITER_NOTE";
type Event = { event: string; properties: Record<string, unknown> };

async function interceptAnalytics(page: Page) {
  const events: Event[] = [];
  const unexpected: string[] = [];
  const requests: string[] = [];
  await page.route("https://*.posthog.com/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push(url.href);
    if (!/^\/(?:i\/v0\/)?e\/$/.test(url.pathname) || request.method() !== "POST") {
      unexpected.push(url.pathname);
    } else {
      let body = request.postDataBuffer()!;
      if (body[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);
      const text = body.toString();
      const data = text.startsWith("data=")
        ? JSON.parse(Buffer.from(new URLSearchParams(text).get("data")!, "base64").toString())
        : JSON.parse(text);
      events.push(...(Array.isArray(data) ? data : (data.batch ?? [data])));
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1}' });
  });
  return { events, unexpected, requests };
}

for (const width of [1280, 390]) {
  test(`PostHog captures hash pageviews and masked clicks at ${width}px`, async ({
    page,
    context,
  }) => {
    test.skip(
      !configured,
      "Optional analytics requires the local public PostHog project configuration.",
    );
    await page.setViewportSize({ width, height: 844 });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "doNotTrack", { configurable: true, get: () => null });
      // Exercise collection as a human browser; production keeps SDK bot filtering.
      Object.defineProperty(navigator, "webdriver", { configurable: true, get: () => false });
    });
    const { events, unexpected, requests } = await interceptAnalytics(page);
    await page.goto(`/?private=${secret}#/oferty?q=${secret}`);
    const pageviews = () => events.filter((event) => event.event === "$pageview");
    await expect.poll(() => pageviews().length).toBe(1);
    expect(pageviews()[0].properties.$pathname).toBe("/oferty");

    // Deliberately adversarial DOM: labels, custom attributes and input values
    // must never cross the network boundary even on a newly added control.
    await page.evaluate((value) => {
      const input = document.createElement("input");
      input.id = "privacy-test-input";
      input.setAttribute("aria-label", "Privacy test input");
      const button = document.createElement("button");
      button.id = value;
      button.className = value;
      button.setAttribute("data-ph-capture-attribute-note", value);
      button.textContent = value;
      document.body.append(input, button);
    }, secret);
    await page.getByLabel("Privacy test input").fill(secret);
    await page.getByRole("button", { name: secret, exact: true }).click();
    await expect
      .poll(() => events.filter((event) => event.event === "$autocapture").length)
      .toBe(1);

    const link = page.getByRole("link", { name: "Metodologia", exact: true }).last();
    await link.focus();
    await link.press("Enter");
    await expect(page).toHaveURL(/#\/metodologia$/);
    await expect.poll(() => pageviews().length).toBe(2);
    expect(pageviews()[1].properties.$pathname).toBe("/metodologia");
    await page.goBack();
    await expect.poll(() => pageviews().length).toBe(3);
    await page.goForward();
    await expect.poll(() => pageviews().length).toBe(4);
    const firstId = pageviews()[0].properties.distinct_id;
    await page.reload();
    await expect.poll(() => pageviews().length).toBe(5);
    expect(pageviews()[4].properties.distinct_id).not.toBe(firstId);

    expect(unexpected).toEqual([]);
    expect(requests.join(" ")).not.toContain(secret);
    expect(JSON.stringify(events)).not.toContain(secret);
    expect(new Set(events.map((event) => event.event))).toEqual(
      new Set(["$pageview", "$autocapture"]),
    );
    for (const event of events) {
      expect(event.properties.$process_person_profile).toBe(false);
      expect(event.properties.$geoip_disable).toBe(true);
      expect(event.properties).not.toHaveProperty("$referrer");
      expect(event.properties).not.toHaveProperty("$set");
      expect(event.properties).not.toHaveProperty("$elements");
      expect(event.properties).not.toHaveProperty("$el_text");
    }
    expect((await context.cookies()).filter((cookie) => cookie.name.startsWith("ph_"))).toEqual([]);
    expect(
      await page.evaluate(() =>
        [...Object.keys(localStorage), ...Object.keys(sessionStorage)].filter((key) =>
          key.startsWith("ph_"),
        ),
      ),
    ).toEqual([]);
  });
}

test("Do Not Track prevents all PostHog requests and privacy text reflows", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, get: () => "1" });
  });
  const { requests } = await interceptAnalytics(page);
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#/polityka-prywatnosci");
    await expect(page.getByRole("heading", { name: "Prywatność prototypu" })).toBeVisible();
    await expect(page.getByText(/PostHog/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  expect(requests).toEqual([]);
});
