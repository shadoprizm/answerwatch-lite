const demoRows = [
  {
    prompt: "best emergency plumber near me",
    engine: "ChatGPT",
    brandMentioned: true,
    competitors: "Pipe Pros, Rapid Rooter",
    sources: "Google Business Profile, HomeStars",
    answer: "North Star Plumbing appears as a local option with Pipe Pros and Rapid Rooter.",
    note: "Good category match, but no weekend-service proof."
  },
  {
    prompt: "plumber open Sunday Ottawa",
    engine: "Perplexity",
    brandMentioned: false,
    competitors: "Pipe Pros, Ottawa Drain Team",
    sources: "Yelp, Reddit",
    answer: "The answer names competitors with visible Sunday hours.",
    note: "Add Sunday availability page and review snippets."
  },
  {
    prompt: "who fixes burst pipes fast in Kanata",
    engine: "Gemini",
    brandMentioned: true,
    competitors: "Rapid Rooter",
    sources: "Google Business Profile",
    answer: "Brand appears but competitor has richer review context.",
    note: "Improve emergency response proof and neighborhood pages."
  }
];

const list = document.querySelector("#observationList");
const form = document.querySelector("#watchForm");
const output = document.querySelector("#reportOutput");
const copyNote = document.querySelector("#copyNote");

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function addRow(data = {}) {
  const row = document.createElement("div");
  row.className = "observation-row";
  row.innerHTML = `
    <label class="full">Prompt
      <input data-field="prompt" value="${escapeAttr(data.prompt || "")}" placeholder="buyer question" />
    </label>
    <label>Engine
      <select data-field="engine">
        ${["ChatGPT", "Perplexity", "Gemini", "Grok", "Google AI"].map((engine) => {
          const selected = (data.engine || "ChatGPT") === engine ? "selected" : "";
          return `<option ${selected}>${engine}</option>`;
        }).join("")}
      </select>
    </label>
    <label class="check-line">
      <input data-field="brandMentioned" type="checkbox" ${data.brandMentioned ? "checked" : ""} />
      Brand mentioned
    </label>
    <label>Competitors
      <input data-field="competitors" value="${escapeAttr(data.competitors || "")}" placeholder="comma separated" />
    </label>
    <label class="full">Answer notes
      <textarea data-field="answer" placeholder="paste or summarize the answer">${escapeHtml(data.answer || "")}</textarea>
    </label>
    <label>Sources cited
      <input data-field="sources" value="${escapeAttr(data.sources || "")}" placeholder="comma separated" />
    </label>
    <label>Action note
      <input data-field="note" value="${escapeAttr(data.note || "")}" placeholder="what to fix" />
    </label>
    <button type="button" class="ghost-button" data-remove>Remove</button>
  `;
  row.querySelector("[data-remove]").addEventListener("click", () => row.remove());
  list.append(row);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function loadDemo() {
  list.innerHTML = "";
  demoRows.forEach(addRow);
  generateReport();
}

function readRows() {
  return [...document.querySelectorAll(".observation-row")].map((row) => ({
    prompt: row.querySelector('[data-field="prompt"]').value.trim(),
    engine: row.querySelector('[data-field="engine"]').value,
    brandMentioned: row.querySelector('[data-field="brandMentioned"]').checked,
    competitors: splitList(row.querySelector('[data-field="competitors"]').value),
    sources: splitList(row.querySelector('[data-field="sources"]').value),
    answer: row.querySelector('[data-field="answer"]').value.trim(),
    note: row.querySelector('[data-field="note"]').value.trim()
  })).filter((row) => row.prompt);
}

function analyze(input) {
  const total = input.observations.length || 1;
  const mentions = input.observations.filter((row) => row.brandMentioned).length;
  const competitors = unique(input.observations.flatMap((row) => row.competitors));
  const sources = unique(input.observations.flatMap((row) => row.sources));
  const notes = unique(input.observations.map((row) => row.note));
  const mentionRate = Math.round((mentions / total) * 100);
  const score = Math.max(0, Math.min(100, Math.round(mentionRate * 0.75 + Math.min(sources.length, 8) * 3)));
  const status = score >= 70 ? "Strong" : score >= 40 ? "Watch" : "At Risk";
  const actions = buildActions(score, mentions, total, competitors, sources, notes);
  return { score, mentionRate, competitors, sources, notes, status, actions };
}

function buildActions(score, mentions, total, competitors, sources, notes) {
  const actions = [];
  if (mentions < total) {
    actions.push("Create pages or FAQ blocks that directly answer the missing buyer-intent prompts.");
  }
  if (competitors.length) {
    actions.push(`Review competitor proof from ${competitors.slice(0, 3).join(", ")} and match their strongest citations.`);
  }
  if (sources.length < 3) {
    actions.push("Add or improve third-party citation signals: directories, reviews, local media, comparison pages, and partner mentions.");
  }
  notes.slice(0, 3).forEach((note) => actions.push(note));
  if (score >= 70 && actions.length < 2) {
    actions.push("Maintain weekly monitoring and reuse the phrases AI engines already associate with the brand.");
  }
  return unique(actions).slice(0, 5);
}

function generateReport() {
  const input = {
    brand: document.querySelector("#brand").value.trim() || "Client brand",
    website: document.querySelector("#website").value.trim() || "Not provided",
    audience: document.querySelector("#audience").value.trim() || "Target buyers",
    category: document.querySelector("#category").value.trim() || "Service category",
    observations: readRows()
  };
  const result = analyze(input);

  document.querySelector("#score").textContent = result.score;
  document.querySelector("#heroScore").textContent = result.score;
  document.querySelector("#mentionRate").textContent = `${result.mentionRate}%`;
  document.querySelector("#sourceCount").textContent = result.sources.length;
  document.querySelector("#status").textContent = result.status;

  const report = [
    `${input.brand} AI Answer Visibility Report`,
    `Website: ${input.website}`,
    `Audience: ${input.audience}`,
    `Category: ${input.category}`,
    "",
    `Visibility score: ${result.score}/100 (${result.status})`,
    `Brand mention rate: ${result.mentionRate}% across ${input.observations.length} prompts`,
    `Competitors found: ${result.competitors.length ? result.competitors.join(", ") : "None recorded"}`,
    `Cited sources found: ${result.sources.length ? result.sources.join(", ") : "None recorded"}`,
    "",
    "Recommended actions:",
    ...result.actions.map((action, index) => `${index + 1}. ${action}`),
    "",
    "Prompt observations:",
    ...input.observations.map((row) => `- ${row.engine}: "${row.prompt}" — ${row.brandMentioned ? "brand mentioned" : "brand missing"}`)
  ].join("\n");

  output.value = report;
  copyNote.textContent = "";
}

document.querySelector("#loadDemo").addEventListener("click", loadDemo);
document.querySelector("#addRow").addEventListener("click", () => addRow());
document.querySelector("#copyReport").addEventListener("click", async () => {
  await navigator.clipboard.writeText(output.value);
  copyNote.textContent = "Report copied.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateReport();
});

loadDemo();
