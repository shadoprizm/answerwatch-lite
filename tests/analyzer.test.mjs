import assert from "node:assert/strict";

function analyzeVisibility(input) {
  const observations = input.observations.filter((item) => item.prompt.trim());
  const total = observations.length || 1;
  const mentions = observations.filter((item) => item.brandMentioned).length;
  const unique = (items) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
  const competitors = unique(observations.flatMap((item) => item.competitors));
  const sources = unique(observations.flatMap((item) => item.sources));
  const mentionRate = Math.round((mentions / total) * 100);
  const score = Math.max(0, Math.min(100, Math.round(mentionRate * 0.75 + Math.min(sources.length, 8) * 3)));
  const status = score >= 70 ? "Strong" : score >= 40 ? "Watch" : "At Risk";
  return { score, mentionRate, competitorCount: competitors.length, sourceCount: sources.length, status };
}

const result = analyzeVisibility({
  brand: "North Star Plumbing",
  website: "https://example.com",
  audience: "Ottawa homeowners",
  category: "Emergency plumbing",
  observations: [
    {
      prompt: "best emergency plumber near me",
      engine: "ChatGPT",
      brandMentioned: true,
      answer: "North Star Plumbing appears with two other providers.",
      competitors: ["Pipe Pros"],
      sources: ["Google Business Profile"],
      note: ""
    },
    {
      prompt: "plumber open Sunday Ottawa",
      engine: "Perplexity",
      brandMentioned: false,
      answer: "Competitors appear instead.",
      competitors: ["Pipe Pros", "Rapid Rooter"],
      sources: ["Yelp", "HomeStars"],
      note: ""
    }
  ]
});

assert.equal(result.mentionRate, 50);
assert.equal(result.competitorCount, 2);
assert.equal(result.sourceCount, 3);
assert.equal(result.status, "Watch");

console.log("analyzer tests passed");
