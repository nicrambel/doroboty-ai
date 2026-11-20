import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { isSafePackageTarget } from "./package-path.mjs";

test("Windows packaging permits external destinations on either drive", () => {
  for (const target of [
    "C:\\Temp\\participant",
    "D:\\packages\\participant",
    "D:\\codex\\doroboty-ai-copy",
  ])
    assert.equal(isSafePackageTarget("D:\\codex\\doroboty-ai", target, path.win32), true);
});
test("packaging rejects the source, its descendants and ancestors", () => {
  for (const target of [
    "D:\\codex\\doroboty-ai",
    "D:\\codex\\doroboty-ai\\packet",
    "D:\\codex",
    "D:\\",
  ])
    assert.equal(isSafePackageTarget("D:\\codex\\doroboty-ai", target, path.win32), false);
  assert.equal(isSafePackageTarget("/work/app", "/work/app/packet", path.posix), false);
  assert.equal(isSafePackageTarget("/work/app", "/tmp/packet", path.posix), true);
});
