import fs from "node:fs";
import path from "node:path";

export function isSafePackageTarget(root, target, paths = path) {
  const contains = (parent, child) => {
    const relative = paths.relative(parent, child);
    return (
      relative === "" ||
      (!paths.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${paths.sep}`))
    );
  };
  return !contains(root, target) && !contains(target, root);
}

export function resolvePackageTarget(root, destination) {
  const parts = [];
  let parent = path.resolve(destination);
  while (!fs.existsSync(parent)) {
    if (fs.lstatSync(parent, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error("Output must not traverse a dangling symbolic link.");
    const ancestor = path.dirname(parent);
    if (ancestor === parent) throw new Error("Output volume or ancestor does not exist.");
    parts.unshift(path.basename(parent));
    parent = ancestor;
  }
  const target = path.join(fs.realpathSync(parent), ...parts);
  if (!isSafePackageTarget(fs.realpathSync(root), target))
    throw new Error("Output must be outside the source repository and not its ancestor.");
  return target;
}
