import posthog, { type CaptureResult, type PostHogConfig } from "posthog-js";

const staticRoutes = new Set([
  "/",
  "/oferty",
  "/metodologia",
  "/polityka-prywatnosci",
  "/app",
  "/app/onboarding",
  "/app/profil",
  "/app/profil/podglad",
  "/app/zapisane",
  "/app/aplikacje",
  "/app/oferty",
  "/app/oferty/nowa",
  "/app/organizacja",
  "/app/kandydaci",
  "/app/case",
  "/app/settings",
]);
const dynamicRoutes: [RegExp, string][] = [
  [/^\/oferty\/[^/]+$/, "/oferty/:slug"],
  [/^\/firmy\/[^/]+$/, "/firmy/:slug"],
  [/^\/aplikuj\/[^/]+$/, "/aplikuj/:slug"],
  [/^\/auth\/[^/]+$/, "/auth/:mode"],
  [/^\/app\/aplikacje\/[^/]+\/wyslano$/, "/app/aplikacje/:id/wyslano"],
  [/^\/app\/aplikacje\/[^/]+$/, "/app/aplikacje/:id"],
  [/^\/app\/oferty\/[^/]+$/, "/app/oferty/:id"],
  [/^\/app\/kandydaci\/[^/]+$/, "/app/kandydaci/:id"],
];

export function analyticsRoute(url: unknown): string {
  if (typeof url !== "string") return "/unknown";
  try {
    const hash = new URL(url, "https://prototype.invalid").hash;
    const path = (hash.slice(1).split(/[?#]/)[0] || "/").replace(/\/$/, "") || "/";
    if (staticRoutes.has(path)) return path;
    return dynamicRoutes.find(([pattern]) => pattern.test(path))?.[1] ?? "/unknown";
  } catch {
    return "/unknown";
  }
}

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const tags = new Set([
  "a",
  "button",
  "div",
  "span",
  "nav",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "ul",
  "li",
  "p",
  "form",
  "body",
  "svg",
  "path",
]);

// Rebuild the selector using only structural data. Never forward text, classes,
// hrefs, IDs, aria labels, custom data attributes or arbitrary SDK properties.
function safeElementsChain(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .split(";")
    .slice(0, 20)
    .map((element) => {
      const tag = element.match(/^[a-z][a-z0-9]*/)?.[0] ?? "div";
      const child = element.match(/\bnth-child="(\d{1,5})"/)?.[1] ?? "0";
      const type = element.match(/\bnth-of-type="(\d{1,5})"/)?.[1] ?? "0";
      return `${tags.has(tag) ? tag : "div"}:nth-child="${child}"nth-of-type="${type}"`;
    })
    .join(";");
}

export function privateEvent(
  event: CaptureResult,
  token: string,
  origin: string,
): CaptureResult | null {
  if (event.event !== "$pageview" && event.event !== "$autocapture") return null;
  const source = event.properties;
  if (typeof source.distinct_id !== "string" || !uuid.test(source.distinct_id)) return null;
  if (event.event === "$autocapture" && source.$event_type !== "click") return null;
  const route = analyticsRoute(source.$current_url);
  const properties: CaptureResult["properties"] = {
    token,
    distinct_id: source.distinct_id,
    $current_url: `${origin}/#${route}`,
    $pathname: route,
    $process_person_profile: false,
    $geoip_disable: true,
  };
  for (const key of ["$session_id", "$window_id", "$device_id"]) {
    if (typeof source[key] === "string" && uuid.test(source[key])) properties[key] = source[key];
  }
  if (event.event === "$autocapture") {
    properties.$event_type = "click";
    properties.$elements_chain = safeElementsChain(source.$elements_chain);
  }
  return { uuid: event.uuid, event: event.event, timestamp: event.timestamp, properties };
}

export function analyticsConfig(
  token: string,
  host: string,
  origin: string,
): Partial<PostHogConfig> {
  return {
    api_host: host,
    defaults: "2026-08-30",
    // The SDK's history_change shorthand only watches pathname, not HashRouter.
    capture_pageview: { path: true, hash: true },
    disable_capture_url_hashes: false,
    capture_pageleave: false,
    autocapture: {
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
      capture_copied_text: false,
      capture_value_css_selector_allowlist: [],
      css_selector_ignorelist: [
        ".ph-no-capture",
        ".ph-no-autocapture",
        "[data-ph-no-autocapture]",
        "[contenteditable]",
        "input",
        "textarea",
        "select",
      ],
    },
    mask_all_text: true,
    mask_all_element_attributes: true,
    mask_personal_data_properties: true,
    person_profiles: "never",
    persistence: "memory",
    disable_persistence: true,
    ip: false,
    respect_dnt: true,
    save_referrer: false,
    save_campaign_params: false,
    disable_session_recording: true,
    enable_recording_console_log: false,
    capture_exceptions: false,
    logs: { captureConsoleLogs: false, beforeSend: () => null },
    metrics: { network: false, flags: false, beforeSend: () => null },
    capture_performance: false,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    rageclick: false,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
    advanced_disable_toolbar_metrics: true,
    debug: false,
    before_send: (event) => privateEvent(event, token, origin),
  };
}

export function startAnalytics() {
  const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
  if (navigator.doNotTrack === "1") return;
  // Analytics is optional; a participant checkout works without an account.
  if (
    !token?.startsWith("phc_") ||
    !["https://eu.i.posthog.com", "https://us.i.posthog.com"].includes(host)
  )
    return;
  posthog.init(token, analyticsConfig(token, host, window.location.origin));
}
