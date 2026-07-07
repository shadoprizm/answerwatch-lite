import { readFileSync } from "node:fs";

const html = readFileSync("web/index.html", "utf8");
const required = [
  "<title>AnswerWatch Lite",
  "North Star Holdings",
  "Try It Now",
  "Free",
  "Pro",
  "Agency"
];

for (const needle of required) {
  if (!html.includes(needle)) {
    throw new Error(`Missing required landing-page content: ${needle}`);
  }
}

console.log("html check passed");
