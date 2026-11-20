import { afterEach, describe, expect, it, vi } from "vitest";
import posthog, { type CaptureResult } from "posthog-js";
import { analyticsRoute, privateEvent, startAnalytics } from "./posthog";

const id = "019a0000-0000-7000-8000-000000000001";
const secret = "PRIVATE_NAME_CV_EMAIL_NOTES";
const sample = (event = "$pageview"): CaptureResult => ({
  uuid: id,
  event,
  timestamp: new Date("2026-11-16T12:00:00Z"),
  $set: { name: secret },
  $set_once: { email: secret },
  properties: {
    distinct_id: id,
    $session_id: id,
    $device_id: id,
    $current_url: `https://example.com/?email=${secret}#/app/aplikacje/${secret}?q=${secret}#${secret}`,
    $referrer: secret,
    $initial_current_url: secret,
    $session_entry_url: secret,
    $set: { cv: secret },
    custom: { notes: secret },
    $elements: [{ $el_text: secret, attr__href: secret }],
    $event_type: "click",
    $elements_chain: `button.${secret}:aria-label="${secret}"nth-child="2"nth-of-type="1";private-person-name:text="${secret}"`,
  },
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("analytics privacy boundary", () => {
  it.each([
    ["/#/", "/"],
    [`/?email=${secret}#/oferty?q=${secret}`, "/oferty"],
    [`/#/oferty/${secret}?section=${secret}`, "/oferty/:slug"],
    [`/#/firmy/${secret}`, "/firmy/:slug"],
    [`/#/aplikuj/${secret}`, "/aplikuj/:slug"],
    [`/#/app/kandydaci/${secret}`, "/app/kandydaci/:id"],
    [`/#/app/oferty/${secret}`, "/app/oferty/:id"],
    ["/#/app/oferty/nowa", "/app/oferty/nowa"],
    [`/#/app/aplikacje/${secret}/wyslano`, "/app/aplikacje/:id/wyslano"],
    [`/#/${secret}`, "/unknown"],
    [`/#/app/profil/${secret}`, "/unknown"],
    [null, "/unknown"],
  ])("replaces private URL content with a fixed route template", (url, route) => {
    expect(analyticsRoute(url)).toBe(route);
  });

  it.each(["$pageview", "$autocapture"])("rebuilds %s from allowed properties only", (name) => {
    const result = privateEvent(sample(name), "phc_test", "https://example.com")!;
    expect(JSON.stringify(result)).not.toContain(secret);
    expect(result).not.toHaveProperty("$set");
    expect(result).not.toHaveProperty("$set_once");
    expect(result.properties.$current_url).toBe("https://example.com/#/app/aplikacje/:id");
    expect(result.properties.$geoip_disable).toBe(true);
    expect(result.properties.$process_person_profile).toBe(false);
    expect(result.properties.distinct_id).toBe(id);
    if (name === "$autocapture") {
      expect(result.properties.$elements_chain).toBe(
        'button:nth-child="2"nth-of-type="1";div:nth-child="0"nth-of-type="0"',
      );
    }
  });

  it.each([
    "$identify",
    "$exception",
    "$snapshot",
    "$pageleave",
    "$copy_autocapture",
    "application_submitted",
  ])("drops unrequested event %s", (name) => {
    expect(privateEvent(sample(name), "phc_test", "https://example.com")).toBeNull();
  });

  it("drops identified users and form-change events", () => {
    const event = sample("$autocapture");
    event.properties.distinct_id = "person@example.com";
    expect(privateEvent(event, "phc_test", "https://example.com")).toBeNull();
    event.properties.distinct_id = id;
    event.properties.$event_type = "change";
    expect(privateEvent(event, "phc_test", "https://example.com")).toBeNull();
  });

  it("keeps a checkout without configuration working without analytics", () => {
    vi.stubGlobal("navigator", { doNotTrack: null });
    vi.stubEnv("VITE_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
    const init = vi.spyOn(posthog, "init");
    expect(() => startAnalytics()).not.toThrow();
    expect(init).not.toHaveBeenCalled();
  });

  it("does not initialize the SDK when the browser requests Do Not Track", () => {
    vi.stubGlobal("navigator", { doNotTrack: "1" });
    vi.stubEnv("VITE_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("VITE_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");
    const init = vi.spyOn(posthog, "init");
    startAnalytics();
    expect(init).not.toHaveBeenCalled();
  });
});
