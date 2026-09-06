import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");

const sourceDirectory = resolve(repositoryRoot, "development/seed/data");
const targetDirectory = resolve(repositoryRoot, "frontend/public/starter-data");

await rm(targetDirectory, {
  recursive: true,
  force: true,
});

await mkdir(targetDirectory, {
  recursive: true,
});

await cp(sourceDirectory, targetDirectory, {
  recursive: true,
});

console.log("Starter data synchronized from development/seed/data.");
