import { readFileSync } from "node:fs";

const files = [
  "web/index.html",
  "web/styles.css",
  "web/script.js",
  "src/answerwatch.ts",
  "README.md",
  "package.json"
];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (content.trim().length < 100) {
    throw new Error(`${file} is unexpectedly small`);
  }
}

console.log("build check passed");
