---
name: palmbay-market-scout
description: Research the Palm Bay / Brevard County land market on the web to find real, current opportunities — new developments, infrastructure projects, builder activity, zoning/annexation changes, competitor listings and pricing, and demand signals. Use whenever the user asks to "find opportunities", "check the market", "what's happening in Palm Bay", scan competitors, or gather material for content. Produces a dated, sourced opportunity brief.
---

# Palm Bay Market Scout

Goal: turn open web research into a short, **sourced, actionable** brief the broker can
act on — not a generic essay. Read `CLAUDE.md` first for business context.

## What to look for (search these each run)

1. **Development & growth** — new master-planned communities, subdivisions, apartment/
   multifamily projects, commercial centers near Palm Bay / SW Palm Bay / St. Johns
   Heritage Parkway / Micco Rd / Malabar Rd. (Ashton Park is the known big one — look for updates.)
2. **Infrastructure** — road widenings (Malabar Rd 2→4 lanes), utility/water-sewer
   extensions, interchanges. Utility extensions raise nearby lot value — flag which units benefit.
3. **Builder activity** — national/regional builders pulling permits or buying lots in Palm Bay.
4. **Zoning / annexation / comp-plan changes** — Palm Bay City Council or Brevard County
   items that change what land can be used for.
5. **Competitor listings** — other Palm Bay vacant-land listings on Crexi/Zillow/LandWatch:
   asking prices, $/sqft, whether they offer owner financing. Compare to our pricing formula.
6. **Demand signals** — population/migration news, "most affordable city" rankings, no-state-
   income-tax angle, Space Coast / KSC employment.

## How to search

Use WebSearch / WebFetch. Prefer primary/local sources: City of Palm Bay, Brevard County,
Florida Today, Space Coast Business, builder press releases, Crexi. Always capture the URL
and date. Discard anything you can't source. Distinguish "confirmed" from "rumored".

## Output — write to a dated brief

Create `content/market-briefs/YYYY-MM-DD-market-brief.md` with:

```
# Palm Bay Market Brief — <date>

## Top 3 opportunities (act this week)
1. <headline> — why it matters to us, which units/quadrant, suggested action. [source]
...

## Development & infrastructure
- <item> [source, date]

## Competitor pricing snapshot
| Source | Location | Size | Asking | ~$/sqft | Owner financing? | vs our price |

## Content angles (feed to palmbay-blog-writer / palmbay-social-content)
- <blog/social idea tied to a real item above>

## Watch list (unconfirmed / next time)
- <item>
```

Keep the "Top 3" genuinely actionable and tied to our inventory (name the units/quadrant).
End by telling the user the 1–2 highest-value next steps and offer to draft the content.
