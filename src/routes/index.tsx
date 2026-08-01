import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpenText, MessagesSquare, Clock3, ArrowRight, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Workplace AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Track emails generated, research summaries, AI chats and time saved, then jump straight into your next task.",
      },
      { property: "og:title", content: "Dashboard | Workplace AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Track emails generated, research summaries, AI chats and time saved, then jump straight into your next task.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails Generated", value: "128", delta: "+18 this week", icon: Mail },
  { label: "Research Summaries", value: "42", delta: "+6 this week", icon: BookOpenText },
  { label: "AI Chats", value: "310", delta: "+54 this week", icon: MessagesSquare },
  { label: "Time Saved", value: "27h", delta: "+3.5h this week", icon: Clock3 },
];

const quickActions = [
  {
    title: "Generate Email",
    description: "Draft a polished message in seconds, with the tone you choose.",
    to: "/email" as const,
    icon: Mail,
  },
  {
    title: "Research Topic",
    description: "Turn a topic or pasted text into a structured brief.",
    to: "/research" as const,
    icon: BookOpenText,
  },
  {
    title: "Ask AI",
    description: "Chat through anything work related and get usable output.",
    to: "/chat" as const,
    icon: MessagesSquare,
  },
];

const activity = [
  { title: "Follow-up email to Priya Nair", meta: "Email generator - 12 minutes ago" },
  { title: "Research brief: hybrid meeting etiquette", meta: "Research assistant - 1 hour ago" },
  { title: "Summarised Q3 planning notes", meta: "Workplace chat - yesterday" },
  { title: "Client proposal, persuasive tone", meta: "Email generator - yesterday" },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Good morning, Alex
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Work Smarter with AI
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Draft emails, summarise research and get instant answers to everyday workplace questions -
          all from one workspace, so you spend less time on routine writing and more time on the
          work that matters.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link to="/email">
              Generate an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/chat">Ask the assistant</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <h2 className="sr-only">Productivity overview</h2>
        {stats.map((stat) => (
          <article key={stat.label} className="card-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <stat.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                <TrendingUp className="size-3" aria-hidden="true" />
                {stat.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Quick actions</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className="card-soft group flex flex-col p-5 transition-shadow hover:shadow-lift"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <action.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-4 font-display text-base font-semibold text-foreground">
                  {action.title}
                </span>
                <span className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Recent activity</h2>
          <ul className="card-soft mt-3 divide-y divide-border">
            {activity.map((item) => (
              <li key={item.title} className="px-5 py-4">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AiDisclaimer className="mt-6" />
    </div>
  );
}
