# Automation — how Palm Bay Lots & Land runs itself

This is the map of what's automated, how to run it, and how to make it run on its own.
Think of it as the six capabilities from the Claude slides, wired to *this* business.

---

## 1. Business memory (so nothing gets re-explained)
`CLAUDE.md` at the repo root loads at the start of every session. It holds the broker
info, the pricing formula, financing terms, quadrants, tech stack, and brand voice.
**Keep it current** — when a price rule or fact changes, edit `CLAUDE.md` and everything
downstream (skills, agents, the site's Derrick prompt) stays consistent.

## 2. Skills (reusable know-how) — `.claude/skills/`
Each folder teaches Claude one job. Invoke by asking naturally, or `/`-name:
| Skill | Ask it to… |
|-------|------------|
| `palmbay-market-scout` | "Find this week's Palm Bay opportunities / check the market" |
| `palmbay-blog-writer` | "Write a blog post about owner financing in Palm Bay" |
| `palmbay-listing-writer` | "Write listing copy for Unit 10, Block 5, Lot 12" |
| `palmbay-social-content` | "Give me 5 social posts about this month's market" |
| `palmbay-lead-followup` | "Draft a follow-up for this lead who asked about financing" |

## 3. Subagents (a team, not one assistant) — `.claude/agents/`
- `opportunity-scout` — runs web research end-to-end and writes a dated, sourced brief to
  `content/market-briefs/`. Spawn several in parallel for fan-out research.

## 4. Autonomy — scheduled Routines (this is "not sitting at the computer")
A **Routine** is a scheduled trigger that wakes a fresh Claude session on its own, runs a
task, and reports back. Set them up from a session (they can be created for you on request).
Recommended starting cadence:

- **Weekly market scan (Mon 8am):** run `palmbay-market-scout` (or spawn `opportunity-scout`),
  write the brief, and surface the Top 3 + suggested blog/social angles.
- **Weekly content batch (Wed 8am):** turn the latest brief into 1 blog draft + 5 social
  posts (drafts only, for review).
- **Lead-followup nudge (as needed):** draft follow-ups for new/stale leads.

Drafts land in `content/` for a human to approve. Nothing is published, emailed, or posted
without an explicit go-ahead and an authorized channel.

### Current Routines
_(none created yet — ask "set up the weekly market scan Routine" and it'll be wired up.)_

## 5. Guardrails
- Read/research/draft = automatic and safe. **Publish / email / post / spend / change the
  live DB = always needs a human go-ahead** and a connected, authorized account.
- Secrets (`BLOG_API_KEY`, `.env`, `*.key`) are never printed or committed.
- Everything the automation produces is a reviewable file in `content/`.

## 6. Where output goes
```
content/
  market-briefs/   ← dated opportunity briefs (from the scout)
  blog-drafts/     ← publish-ready blog JSON
  listings/        ← listing copy
  social/          ← social post batches
  lead-followups/  ← follow-up drafts
```
