/**
 * Internal response library for the workplace chat assistant.
 * Implementation detail - never rendered as prompt text in the UI.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export const SUGGESTED_PROMPTS = [
  "Write an email",
  "Summarize meeting notes",
  "Create an agenda",
  "Improve text",
] as const;

const RESPONSES: { match: RegExp; reply: string }[] = [
  {
    match: /email|draft|reply|follow[- ]?up/i,
    reply: `Here's a draft you can adapt:

**Subject:** Quick update and next steps

Hi Sam,

Thanks for your patience on this. I wanted to share a short update and confirm what happens next.

- The first phase is complete and signed off.
- Two smaller items are outstanding and are scheduled for next week.
- No impact is expected on the overall delivery date.

If anything above doesn't match your understanding, let me know and I'll adjust. Otherwise I'll send a final recap once the remaining items close.

Best,
[Your name]

Want me to make it shorter, more formal, or more persuasive?`,
  },
  {
    match: /summar|notes|minutes|recap|transcript/i,
    reply: `Here's a structured summary of the notes:

**Purpose:** Review progress and agree on next steps for the current workstream.

**Decisions**
- Proceed with the proposed approach; no change to scope.
- Move the checkpoint review to the end of next week.
- Owner confirmed for the outstanding data question.

**Action items**
| Owner | Action | Due |
| --- | --- | --- |
| Priya | Circulate revised timeline | Wed |
| Marcus | Confirm vendor pricing | Fri |
| You | Share summary with the wider team | Today |

**Open questions**
- Is additional budget required for the extended review?
- Who signs off the final version?

Want this as a shorter paragraph, or formatted as an email?`,
  },
  {
    match: /agenda|meeting plan|workshop|stand[- ]?up/i,
    reply: `Here's a 60-minute agenda you can use as-is:

**Team Sync - Thursday, 60 minutes**

1. **Welcome and objectives** (5 min) - restate the decision needed today.
2. **Progress since last session** (10 min) - what shipped, what slipped.
3. **Key discussion: priorities for the next sprint** (20 min) - focused debate, one topic only.
4. **Risks and blockers** (10 min) - surface anything that needs escalation.
5. **Decisions and owners** (10 min) - confirm who does what by when.
6. **Wrap-up** (5 min) - recap and close.

**Preparation:** attendees review the status doc beforehand.
**Outcome:** a written decision log circulated within 24 hours.

Want a 30-minute version instead?`,
  },
  {
    match: /improve|rewrite|polish|proofread|clearer|concise|tone/i,
    reply: `Here's a cleaner version of that text:

**Revised**
"Following our review, we recommend proceeding with the proposed approach. The work can be absorbed by the current team, and we expect the first results within four weeks. We'll confirm progress at the midpoint checkpoint."

**What changed**
- Removed hedging language ("we think maybe", "possibly") that weakened the message.
- Led with the recommendation instead of the background.
- Cut the word count by roughly 40% without losing meaning.
- Made the timeline specific so the reader knows what to expect.

Paste any other text and I'll do the same - or tell me the tone you want.`,
  },
  {
    match: /present|slide|deck/i,
    reply: `Here's a simple five-slide structure that works for most internal updates:

1. **The point** - one sentence on what you want the audience to take away.
2. **Where we are** - current status in three bullets, no more.
3. **What we learned** - the insight that changes the decision.
4. **The recommendation** - what you're asking for, stated plainly.
5. **Next steps and owners** - who does what by when.

Keep one idea per slide and put detail in an appendix. Want me to draft the speaker notes?`,
  },
  {
    match: /priorit|to[- ]?do|task|plan my day|schedule/i,
    reply: `Here's a practical way to structure the day:

**Now (deep work, 90 min)**
- The one task that moves your most important goal forward. Protect this block.

**Next (60 min)**
- Two or three items with real deadlines this week.

**Later (batched, 30 min)**
- Email, approvals, small replies - handle these in one pass rather than throughout the day.

**Not today**
- Anything with no deadline and no owner waiting on you. Write it down and let it go.

Tell me your actual list and I'll sort it into these buckets.`,
  },
];

const FALLBACK = `Happy to help with that. Here's how I'd approach it:

1. **Clarify the outcome** - what does a good result look like, and who needs to see it?
2. **Gather the inputs** - the notes, data or context that already exist.
3. **Draft quickly** - get a rough version down; editing is faster than starting from blank.
4. **Review and tighten** - check accuracy, cut anything that doesn't earn its place.

If you share a few more details - the audience, the tone and the deadline - I can produce a full draft for you right away.`;

export function generateChatReply(input: string): string {
  const found = RESPONSES.find((entry) => entry.match.test(input));
  return found ? found.reply : FALLBACK;
}
