export type Observation = {
  prompt: string;
  engine: string;
  brandMentioned: boolean;
  answer: string;
  competitors: string[];
  sources: string[];
  note: string;
};

export type ReportInput = {
  brand: string;
  website: string;
  audience: string;
  category: string;
  observations: Observation[];
};

export type ReportResult = {
  score: number;
  mentionRate: number;
  competitorCount: number;
  sourceCount: number;
  status: "Strong" | "Watch" | "At Risk";
  actions: string[];
  report: string;
};

const uniqueClean = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

export function analyzeVisibility(input: ReportInput): ReportResult {
  const observations = input.observations.filter((item) => item.prompt.trim());
  const total = observations.length || 1;
  const mentions = observations.filter((item) => item.brandMentioned).length;
  const mentionRate = Math.round((mentions / total) * 100);
  const competitors = uniqueClean(observations.flatMap((item) => item.competitors));
  const sources = uniqueClean(observations.flatMap((item) => item.sources));
  const score = Math.max(0, Math.min(100, Math.round(mentionRate * 0.75 + Math.min(sources.length, 8) * 3)));
  const status = score >= 70 ? "Strong" : score >= 40 ? "Watch" : "At Risk";
  const actions = buildActions(score, mentions, total, competitors, sources);
  const report = buildReport(input, score, mentionRate, status, competitors, sources, actions);

  return {
    score,
    mentionRate,
    competitorCount: competitors.length,
    sourceCount: sources.length,
    status,
    actions,
    report
  };
}

function buildActions(
  score: number,
  mentions: number,
  total: number,
  competitors: string[],
  sources: string[]
): string[] {
  const actions: string[] = [];
  if (mentions < total) {
    actions.push("Create or update service pages that answer the missing buyer questions directly.");
  }
  if (competitors.length > 0) {
    actions.push(`Compare content depth against ${competitors.slice(0, 3).join(", ")} and fill the obvious proof gaps.`);
  }
  if (sources.length < 3) {
    actions.push("Improve third-party citations: directory listings, comparison pages, review sites, and authoritative mentions.");
  }
  if (score < 50) {
    actions.push("Run the same prompt set weekly until brand mentions and source coverage improve.");
  }
  if (actions.length === 0) {
    actions.push("Maintain weekly monitoring and use winning answer phrasing in sales copy.");
  }
  return actions;
}

function buildReport(
  input: ReportInput,
  score: number,
  mentionRate: number,
  status: string,
  competitors: string[],
  sources: string[],
  actions: string[]
): string {
  return [
    `${input.brand} AI Answer Visibility Report`,
    `Website: ${input.website || "Not provided"}`,
    `Audience: ${input.audience || "Not provided"}`,
    `Category: ${input.category || "Not provided"}`,
    "",
    `Visibility score: ${score}/100 (${status})`,
    `Brand mention rate: ${mentionRate}%`,
    `Competitors found: ${competitors.length ? competitors.join(", ") : "None recorded"}`,
    `Cited sources found: ${sources.length ? sources.join(", ") : "None recorded"}`,
    "",
    "Recommended actions:",
    ...actions.map((action, index) => `${index + 1}. ${action}`)
  ].join("\n");
}
