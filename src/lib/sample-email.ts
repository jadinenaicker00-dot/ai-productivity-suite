/**
 * Internal draft-composition templates for the email generator.
 * These are implementation details and are never surfaced in the UI.
 */

export type EmailTone = "formal" | "friendly" | "persuasive";

export type EmailRequest = {
  recipient: string;
  subject: string;
  purpose: string;
  tone: EmailTone;
  instructions: string;
};

export const TONE_OPTIONS: { value: EmailTone; label: string; hint: string }[] = [
  { value: "formal", label: "Formal", hint: "Precise, respectful, corporate" },
  { value: "friendly", label: "Friendly", hint: "Warm, approachable, human" },
  { value: "persuasive", label: "Persuasive", hint: "Confident, benefit-led" },
];

const firstName = (recipient: string) => {
  const cleaned = recipient.replace(/<[^>]*>/g, "").trim();
  if (!cleaned) return "there";
  const namePart = (cleaned.includes("@") ? cleaned.split("@")[0] : cleaned) ?? cleaned;
  const token = namePart.split(/[\s._-]+/)[0] || "there";
  return token.charAt(0).toUpperCase() + token.slice(1);
};


const purposeLine = (purpose: string) =>
  purpose.trim()
    ? purpose.trim().replace(/\.$/, "")
    : "align on the next steps for our current workstream";

type Builder = (name: string, topic: string) => string;

const formalVariants: Builder[] = [
  (name, topic) => `Dear ${name},

I hope this message finds you well.

I am writing to ${topic}. Following our recent discussions, I wanted to set out the position clearly so that we can move forward without further delay.

The key points are as follows:

1. Current status - the work is progressing in line with the agreed scope, and no material risks have been identified to date.
2. Requested action - your confirmation on the outstanding items would allow us to proceed to the next stage.
3. Timeline - subject to your response, we expect to close this out within five working days.

I would be grateful if you could review the above and share any comments by the end of the week. I am happy to arrange a short call should you prefer to discuss it directly.

Thank you for your time and continued support.

Kind regards,
[Your name]
[Job title] | [Department]`,
  (name, topic) => `Dear ${name},

Thank you for your patience while we finalised the details.

The purpose of this email is to ${topic}. Please find below a concise summary for your consideration.

Background: the item was raised during our last review and has since been assessed by the team.
Assessment: we consider the proposed approach to be both practical and consistent with existing procedures.
Recommendation: we suggest proceeding as outlined, with a formal checkpoint at the midpoint.

Should you require any additional documentation, I will be pleased to provide it. Please confirm at your earliest convenience so that the relevant parties can be informed.

Yours sincerely,
[Your name]
[Job title] | [Department]`,
];

const friendlyVariants: Builder[] = [
  (name, topic) => `Hi ${name},

Hope your week is going well!

I wanted to reach out to ${topic}. Nothing urgent, but I figured it would be easier to get it down in writing so we're both on the same page.

Here's where things stand:
- The main pieces are in place and moving along nicely.
- There are a couple of small decisions left that I'd love your input on.
- Once we've got those, I can take it from there.

If it's easier to talk it through, I'm free most afternoons this week - just grab a slot in my calendar.

Thanks so much for your help with this.

Best,
[Your name]`,
  (name, topic) => `Hi ${name},

Quick note from me - I wanted to ${topic}.

Short version: things are in good shape, and I just need a thumbs up from you on the remaining details so we can keep the momentum going.

A few things worth flagging:
- Everything we agreed last time has been actioned.
- One small change to timings, which shouldn't affect anything on your side.
- I'll send a short recap once it's wrapped up.

Let me know if anything looks off, otherwise I'll assume we're good to go. Really appreciate you keeping an eye on this.

Cheers,
[Your name]`,
];

const persuasiveVariants: Builder[] = [
  (name, topic) => `Hi ${name},

I'll keep this brief, because I think the opportunity here is genuinely worth your time.

I'm writing to ${topic}. Based on what we've seen so far, acting now puts us in a materially stronger position than waiting another quarter.

Why this matters:
- Impact: the change addresses the single biggest source of delay in the current process.
- Effort: the work required is modest and can be absorbed by the existing team.
- Timing: approving now means the benefit lands before the next reporting cycle.

All I need is a short confirmation to proceed. If you'd prefer, I can walk you through the reasoning in fifteen minutes this week - I'm confident you'll reach the same conclusion.

Looking forward to your response.

Best regards,
[Your name]`,
  (name, topic) => `Hi ${name},

There's a decision in front of us that deserves a clear recommendation, so here it is: we should ${topic}.

Three reasons:

1. It removes friction people already feel every day, which means adoption will be immediate rather than forced.
2. The cost of doing nothing compounds - every week of delay adds rework we will pay for later.
3. We already have everything we need to start, so there is no dependency holding us back.

I'm not asking for a long process. A single approval unlocks the first step, and I'll report back with measurable results within a month.

Can I count on your support?

Best regards,
[Your name]`,
];

const VARIANTS: Record<EmailTone, Builder[]> = {
  formal: formalVariants,
  friendly: friendlyVariants,
  persuasive: persuasiveVariants,
};

export function generateEmail(req: EmailRequest, attempt = 0): string {
  const name = firstName(req.recipient);
  const topic = purposeLine(req.purpose);
  const pool = VARIANTS[req.tone];
  const builder = pool[attempt % pool.length] ?? pool[0]!;
  const body = builder(name, topic);


  const subject = req.subject.trim() || "Following up on our recent discussion";
  const extra = req.instructions.trim()
    ? `\n\nP.S. ${req.instructions.trim().replace(/^p\.s\.\s*/i, "")}`
    : "";

  return `Subject: ${subject}\n\n${body}${extra}`;
}
