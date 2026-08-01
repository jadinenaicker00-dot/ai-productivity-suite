import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, RefreshCw, ScrollText, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { cn } from "@/lib/utils";
import { generateResearch, researchToMarkdown, type ResearchResult } from "@/lib/sample-research";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Turn any topic or pasted text into an executive summary, key insights and clear recommendations you can edit and export.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content:
          "Turn any topic or pasted text into an executive summary, key insights and clear recommendations you can edit and export.",
      },
    ],
  }),
  component: ResearchAssistant,
});

type EditableResult = {
  topic: string;
  summary: string;
  insights: string;
  recommendations: string;
};

const toEditable = (result: ResearchResult): EditableResult => ({
  topic: result.topic,
  summary: result.summary,
  insights: result.insights.map((item) => `- ${item}`).join("\n"),
  recommendations: result.recommendations.map((item, i) => `${i + 1}. ${item}`).join("\n"),
});

const toMarkdown = (value: EditableResult) =>
  researchToMarkdown({
    topic: value.topic,
    summary: value.summary,
    insights: value.insights.split("\n").map((l) => l.replace(/^[-*]\s*/, "")),
    recommendations: value.recommendations.split("\n").map((l) => l.replace(/^\d+[.)]\s*/, "")),
  });

function ResearchAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<EditableResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);

  const run = (nextAttempt: number) => {
    setLoading(true);
    setAttempt(nextAttempt);
    window.setTimeout(() => {
      setResult(toEditable(generateResearch(input, nextAttempt)));
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    run(0);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(toMarkdown(result));
    toast.success("Research brief copied");
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([toMarkdown(result)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.topic.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50)}-brief.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Brief exported as Markdown");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="AI Research Assistant"
        title="From raw topic to a brief you can send"
        description="Enter a topic or paste text. You'll get an executive summary, key insights and recommendations - all editable and exportable."
      />

      <form onSubmit={handleSubmit} className="card-soft mt-6 space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or pasted text</Label>
          <Textarea
            id="topic"
            placeholder="e.g. AI adoption in mid-size professional services firms - or paste an article, report or set of notes."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-32 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="rounded-xl" disabled={loading}>
            <Search className="size-4" />
            {loading ? "Analysing..." : "Generate brief"}
          </Button>
          {result && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={loading}
              onClick={() => run(attempt + 1)}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Regenerate
            </Button>
          )}
        </div>
      </form>

      {result ? (
        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Research brief</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleCopy}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleExport}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>

          <article className="card-soft p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              Executive Summary
            </h3>
            <Textarea
              aria-label="Executive summary"
              value={result.summary}
              onChange={(e) => setResult({ ...result, summary: e.target.value })}
              className="mt-3 min-h-40 rounded-xl bg-surface text-sm leading-relaxed"
            />
          </article>

          <article className="card-soft p-6">
            <h3 className="font-display text-base font-semibold text-foreground">Key Insights</h3>
            <Textarea
              aria-label="Key insights"
              value={result.insights}
              onChange={(e) => setResult({ ...result, insights: e.target.value })}
              className="mt-3 min-h-48 rounded-xl bg-surface text-sm leading-relaxed"
            />
          </article>

          <article className="card-soft p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              Recommendations
            </h3>
            <Textarea
              aria-label="Recommendations"
              value={result.recommendations}
              onChange={(e) => setResult({ ...result, recommendations: e.target.value })}
              className="mt-3 min-h-48 rounded-xl bg-surface text-sm leading-relaxed"
            />
          </article>

          <AiDisclaimer />
        </section>
      ) : (
        <div className="card-soft mt-6 flex flex-col items-center justify-center p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
            <ScrollText className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-base font-semibold text-foreground">
            No brief yet
          </p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Add a topic above and the assistant will structure it into a summary, insights and
            recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
