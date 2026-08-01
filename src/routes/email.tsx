import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, RefreshCw, Sparkle, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { cn } from "@/lib/utils";
import { generateEmail, TONE_OPTIONS, type EmailTone } from "@/lib/sample-email";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional emails in seconds. Choose a formal, friendly or persuasive tone, then edit, copy or download the result.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content:
          "Draft professional emails in seconds. Choose a formal, friendly or persuasive tone, then edit, copy or download the result.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [instructions, setInstructions] = useState("");

  const [draft, setDraft] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);

  const run = (nextAttempt: number) => {
    setLoading(true);
    setAttempt(nextAttempt);
    window.setTimeout(() => {
      setDraft(generateEmail({ recipient, subject, purpose, tone, instructions }, nextAttempt));
      setLoading(false);
    }, 700);
  };

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    run(0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    toast.success("Email copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(subject || "email-draft").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Draft downloaded");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Write the email, skip the blank page"
        description="Tell the assistant who you're writing to and why. It returns a complete draft you can edit, copy or download."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={handleGenerate} className="card-soft h-fit space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Priya Nair"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Project Atlas - status update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="confirm the revised timeline and ask for sign-off"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="min-h-24 rounded-xl"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">Tone</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  aria-pressed={tone === option.value}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    tone === option.value
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Keep it under 150 words and mention the Thursday deadline."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-20 rounded-xl"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            <Wand2 className="size-4" />
            {loading ? "Generating..." : "Generate email"}
          </Button>
        </form>

        <section className="card-soft flex min-h-[28rem] flex-col p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Generated draft</h2>
            {draft && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={handleCopy}>
                  <Copy className="size-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={handleDownload}>
                  <Download className="size-4" /> Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={loading}
                  onClick={() => run(attempt + 1)}
                >
                  <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Regenerate
                </Button>
              </div>
            )}
          </div>

          {draft ? (
            <>
              <Textarea
                aria-label="Generated email draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="mt-4 min-h-[26rem] flex-1 rounded-xl bg-surface font-sans text-sm leading-relaxed"
              />
              <AiDisclaimer variant="compact" className="mt-3" />
            </>
          ) : (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
                <Sparkle className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-foreground">
                Your draft will appear here
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Fill in the details on the left and generate. Everything stays editable afterwards.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
