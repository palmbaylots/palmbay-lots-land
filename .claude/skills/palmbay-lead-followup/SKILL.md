---
name: palmbay-lead-followup
description: Draft warm, personal follow-up messages (email / SMS / call script) to leads who inquired about Palm Bay lots, tuned to where they are in the buying journey and to owner-financing questions. Use when the user wants to follow up with a lead, write a nurture sequence, respond to an inquiry, or reduce no-response leads. Produces ready-to-send drafts — never sends automatically.
---

# Palm Bay Lead Follow-up

Read `CLAUDE.md`. Leads come in via the site (`backend/routes/leads.py`: name, email, phone).
Goal: helpful, human, low-pressure follow-up that moves the lead toward picking a lot or a call.

## Inputs
Lead name, what they asked about (quadrant, budget, financing?), and stage:
- **New inquiry** — thank + answer their question + invite a quick call.
- **Sent info, no reply** — one useful nudge (a relevant fact or lot), not "just checking in".
- **Financing-curious** — explain personal approval, 25%/35% down, deed at 35%, no bank.
- **Ready** — lay out the simple 3-step process and next action.

## Produce
For each lead/stage: an **email** (subject + body), an **SMS** (≤ 320 chars), and a **call
script** with 2–3 talking points and one question to ask. Warm, concise, specific to their
interest. Always give the real next step and the phone (321-333-7230). Sign as Vahid / the team.

Never fabricate lot availability or prices — reference the pricing formula and defer specifics
to Vahid. Save drafts to `content/lead-followups/<lead-or-date>.md`. These are drafts for a
human to send; do not email/SMS anyone without explicit go-ahead and an authorized channel.
