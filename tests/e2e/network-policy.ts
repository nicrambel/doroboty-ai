export function isExternalApplicationRequest(url: string, baseURL: string) {
  // Chrome's built-in PDF viewer is browser UI, not an application integration.
  if (
    url.startsWith("chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/") ||
    url.startsWith("chrome://resources/") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  )
    return false;
  return new URL(url).origin !== new URL(baseURL).origin;
}
