import { describe, expect, it } from "vitest";
import { isExternalApplicationRequest } from "../e2e/network-policy";

describe("application network boundary", () => {
  const origin = "http://127.0.0.1:3106";
  it("keeps exact-origin assets and browser PDF resources separate", () => {
    for (const url of [
      `${origin}/cv/example.pdf`,
      "chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/index.html",
      "chrome://resources/css/text_defaults_md.css",
      "data:image/png;base64,AA==",
      `blob:${origin}/example`,
    ])
      expect(isExternalApplicationRequest(url, origin)).toBe(false);
  });
  it("still rejects external requests, origin lookalikes and other extensions", () => {
    for (const url of [
      "https://example.com/telemetry",
      "http://127.0.0.1:31060/asset",
      "http://127.0.0.1:3106@example.com/asset",
      "https://127.0.0.1:3106/asset",
      "chrome-extension://unrelated-extension/script.js",
      "ws://127.0.0.1:3106/socket",
    ])
      expect(isExternalApplicationRequest(url, origin)).toBe(true);
  });
});
