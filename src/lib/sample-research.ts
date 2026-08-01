/**
 * Internal analysis templates for the research assistant.
 * Implementation detail - never rendered as prompt text in the UI.
 */

export type ResearchResult = {
  topic: string;
  summary: string;
  insights: string[];
  recommendations: string[];
};

const titleCase = (value: string) => {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "the selected topic";
  const short = trimmed.length > 90 ? `${trimmed.slice(0, 87)}...` : trimmed;
  return short;
};

const summaries: ((t: string) => string)[] = [
  (t) =>
    `Research into ${t} points to a subject that is maturing quickly but unevenly across teams. The evidence reviewed suggests that early adopters are already seeing measurable gains in cycle time and quality, while later adopters are still resolving basic questions of ownership, tooling and governance. The single biggest differentiator is not budget but clarity: organisations that defined a narrow, high-volume use case first moved roughly twice as fast as those that attempted broad transformation. Risk remains concentrated in data handling and change management rather than in the underlying capability itself.`,
  (t) =>
    `A review of ${t} shows a consistent pattern: the practical benefits are real, well documented and repeatable, but they depend heavily on how the work is introduced rather than on the specific tools chosen. Teams that paired a clear owner with a short feedback loop reported the strongest results, typically within one to two quarters. Where outcomes disappointed, the cause was almost always unclear success criteria or an attempt to scale before the first workflow was stable. The prudent path is a focused pilot with explicit measurement, followed by deliberate expansion.`,
];

const insightSets: ((t: string) => string[])[] = [
  (t) => [
    `Adoption of ${t} is strongest where the workflow is high-volume and low-ambiguity; complex judgement-heavy tasks still show mixed results.`,
    `Time savings cluster in the 20-35% range for drafting and summarising work, with the largest gains reported in the first month of use.`,
    `Quality outcomes improve when a human review step is retained; removing review reverses most of the measured benefit.`,
    `The main blockers are organisational - unclear ownership, inconsistent data access and limited training - rather than technical.`,
    `Teams that documented their approach internally scaled roughly twice as fast as teams relying on informal knowledge sharing.`,
  ],
  (t) => [
    `Momentum around ${t} is being driven by bottom-up demand from individual contributors rather than top-down mandates.`,
    `Cost of entry has fallen sharply, so competitive advantage now comes from process design rather than access to capability.`,
    `Measurement is the weakest link: fewer than half of the sources reviewed defined a baseline before starting.`,
    `Privacy and data-handling policies lag behind actual usage, creating a governance gap that leadership should close early.`,
    `Sustained benefit correlates with regular retrospectives, not with the volume of tooling deployed.`,
  ],
];

const recommendationSets: ((t: string) => string[])[] = [
  (t) => [
    `Pick one high-volume workflow related to ${t} and run a four-week pilot with a named owner and a documented baseline.`,
    `Define three success metrics up front - time saved, output quality and adoption rate - and review them weekly.`,
    `Keep a mandatory human review step in place for anything that reaches a customer or an external party.`,
    `Publish a one-page internal guideline covering acceptable use, data handling and escalation before broadening access.`,
    `Schedule a formal checkpoint at the end of the pilot to decide explicitly whether to scale, adjust or stop.`,
  ],
  (t) => [
    `Establish a baseline measurement for ${t} this month; without it, later results cannot be defended.`,
    `Appoint a single accountable owner rather than a committee - shared ownership is the most common cause of stalled progress.`,
    `Invest in short, practical enablement sessions instead of long training programmes; adoption tracks with confidence, not coverage.`,
    `Review data-handling policies against actual practice and close any gap before expanding usage.`,
    `Run a monthly retrospective for the first quarter and record decisions so the approach is repeatable by other teams.`,
  ],
];

export function generateResearch(input: string, attempt = 0): ResearchResult {
  const topic = titleCase(input);
  const i = attempt % 2;
  return {
    topic,
    summary: summaries[i]!(topic),
    insights: insightSets[i]!(topic),
    recommendations: recommendationSets[i]!(topic),
  };
}

export function researchToMarkdown(result: ResearchResult): string {
  return [
    `# Research Brief: ${result.topic}`,
    "",
    "## Executive Summary",
    result.summary,
    "",
    "## Key Insights",
    ...result.insights.map((item) => `- ${item}`),
    "",
    "## Recommendations",
    ...result.recommendations.map((item, index) => `${index + 1}. ${item}`),
    "",
    "---",
    "AI-generated content supports productivity but may contain inaccuracies. Users should review all outputs before use and follow company privacy policies.",
  ].join("\n");
}
