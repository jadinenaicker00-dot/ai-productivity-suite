# AI Workplace Productivity Assistant

A responsive, light-mode SaaS app that helps office employees draft emails, summarize research, and chat with an AI assistant. All outputs come from realistic built-in sample content — no backend, no login.

## Design system

- Blue / white / grey palette, light mode only, defined as semantic tokens in `src/styles.css`.
- Rounded cards, soft shadows, generous spacing, clean sans typography (not Inter/Poppins defaults).
- Persistent left sidebar on desktop; collapses to a slide-over drawer with a top bar on mobile.

## Screens

**Dashboard (`/`)** — replaces the placeholder index.
- "Work Smarter with AI" welcome section.
- Four stat cards: Emails Generated, Research Summaries, AI Chats, Time Saved.
- Quick action buttons linking to Generate Email, Research Topic, Ask AI.

**Smart Email Generator (`/email`)**
- Form: Recipient, Subject, Purpose, Tone (Formal / Friendly / Persuasive), Additional Instructions.
- On generate: short loading state, then a fully editable textarea with the drafted email.
- Actions: Copy, Download (.txt), Regenerate (produces a different variant).
- Sample email templates vary by tone and merge in the entered recipient/subject/purpose.

**AI Research Assistant (`/research`)**
- Input for a topic or pasted text.
- Output in three editable sections: Executive Summary, Key Insights (bullets), Recommendations.
- Actions: Copy and Export (.txt / .md download), Regenerate.

**AI Workplace Chat (`/chat`)**
- Chat transcript built with AI Elements primitives (conversation, message, prompt-input, shimmer).
- Placeholder: "Ask me anything about work..."
- Suggested prompt chips: Write an email, Summarize meeting notes, Create an agenda, Improve text.
- Replies come from a keyword-matched sample response library with a brief typing state.

## Responsible AI

A reusable disclaimer component shown on the dashboard and beneath every generated output:
"AI-generated content supports productivity but may contain inaccuracies. Users should review all outputs before use and follow company privacy policies."

## Technical notes

- TanStack Start routes: `src/routes/index.tsx`, `/email`, `/research`, `/chat`, plus a shared app shell layout with the sidebar.
- Sample-output generators live in `src/lib/sample-*.ts`; the "hidden prompt" templates that shape each output stay in code and are never rendered to users.
- Local component state only — no database or auth. Stat card figures are static demo values.
- Per-route `head()` metadata with unique titles and descriptions.
