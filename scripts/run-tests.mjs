import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const tmpOutDir = fs.mkdtempSync(path.join(os.tmpdir(), "centmeta-test-"));
const tscBin = path.join(rootDir, "node_modules", "typescript", "bin", "tsc");

const tsFiles = [
  path.join(rootDir, "utils", "mtg.ts"),
  path.join(rootDir, "utils", "decklistParser.ts"),
  path.join(rootDir, "utils", "scryfallSearch.ts"),
  path.join(rootDir, "utils", "notesStorage.ts"),
];

try {
  execFileSync(
    process.execPath,
    [
      tscBin,
      "--outDir",
      tmpOutDir,
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--target",
      "ES2020",
      "--esModuleInterop",
      "--strict",
      "--skipLibCheck",
      ...tsFiles,
    ],
    { stdio: "inherit", cwd: rootDir },
  );

  execFileSync(
    process.execPath,
    ["--test", path.join(rootDir, "tests", "utils.test.mjs")],
    {
      stdio: "inherit",
      cwd: rootDir,
      env: { ...process.env, CENTMETA_TEST_DIST: tmpOutDir },
    },
  );
} finally {
  fs.rmSync(tmpOutDir, { recursive: true, force: true });
}
