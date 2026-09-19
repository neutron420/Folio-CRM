# PROGRESS.md

Running state of the template-to-**Aria CRM** conversion. **This file is the handoff.**
`CLAUDE.md` says *how* to work here; this file says *where we are*.

> **Portability note:** the structure below (Snapshot / Backlog / Decisions / Log /
> Questions) is the reusable part. Copy the headings to a new project and refill.

---

## How to use this file

- After any change that lands: add a dated line under **Change log**.
- When a backlog item is finished: tick it and move it to the Change log.
- When a choice is made that is not obvious from the code: record it under
  **Decisions** with the reason. Future sessions read this instead of guessing.
- When something is unclear and blocking: put it under **Open questions**, do not
  guess and build on the guess.
- Keep entries one or two lines. This is a log, not a spec.

---

## The product

**Aria CRM — a WhatsApp-native CRM.** (Brand + tagline read off the sign-in page at
<https://crm.realityrift.co/>, 2026-08-29. App is auth-gated; workspaces live on
`*.crm.realityrift.co`.)

This repo is a **paid template** the founder bought (`shadcn-saas-landing`, from the
`ruixen.com` product line). We are converting it into the Aria CRM marketing site.

---

## ⚠ Direction was wrong — read this first

An earlier pass rebranded the template toward **"Folio"**, an AI data-warehouse /
BI product. That is not our product and never was. Five commits went that way:

```
3a78a89  Sweep visible strings in dead-code components from automation to data theme
0287222  Rewrite Contact page and pricing CTA to Folio's data-intelligence voice
f89b3fb  Rewrite Terms and Privacy pages to Folio's data theme
fe8de05  Stop navbar blur/width flickering on theme toggle   (styling — unaffected)
6f78041  Refactor HowItWorks/HeroHeader layout                (styling — unaffected)
```

The two styling commits are fine and should be kept. The three copy commits moved the
site further from Aria CRM and need reversing — **by rewriting, not by reverting**,
since they also fixed real layout and structure along the way.

**Scale:** 58 `Folio` occurrences across 22 files. But the string swap is the small
part. The *claims* are wrong: the FAQ answers name Snowflake, BigQuery, dbt and
LookML; the testimonials praise generated SQL; the hero sells "no SQL required".

**Do not bulk-replace `Folio` with `Aria CRM`.** It yields "Aria CRM connects to
Postgres, Snowflake, and Redshift" — worse than leaving it, because it reads as
intentional.

---

## Snapshot — 2026-08-29

**Stack:** Next.js 15.5.9 · React 19 · Tailwind 4 · Biome · pnpm 10.7
**Nature:** fully static marketing site — no backend, no DB, no auth, no email
**Live routes:** `/` · `/contact` · `/pricing` · `/privacy` · `/terms`
**Landing composition** (`src/app/(home)/page.tsx`):
Hero → AutoScrollingClientCarousel → HowItWorks → Bento → FeatureTabs → Testimonials → FAQs

**Origin:** copied from a Mac tree (`ruixen_ui/RUIXEN_PRODUCTS/prod-03 copy`), with
assets pulled in from a separate `folio.com` project. Now worked on under Windows.

**Uncommitted in tree** (verify before building on it): `bento.tsx` (~119 lines),
`feature-tabs.tsx`, `how-it-works.tsx`, `customers.tsx`, `testimonials.tsx`,
`hero-header.tsx`, plus four `TiemposHeadline-*.otf` modified for line-ending reasons
only.

---

## Backlog

### Tier 1 — mechanical, safe once the wordmark is confirmed

Pure identity strings. No product claims involved.

- [ ] `src/lib/metadata.ts` — `https://Folio.ai`, `siteName: 'Folio'`, `@Folio_ai`
- [ ] `src/app/layout.tsx` — title template `'%s | Folio'` and default
- [ ] `src/app/layout.config.tsx` — `title`, `owner`, `description`, `githubUrl`
- [ ] `public/site.webmanifest` — `name`, `short_name`
- [ ] `src/components/logo.tsx` — `alt='Folio'`
- [ ] `src/components/hero-header.tsx` — wordmark beside logo (already says "Aria CRM";
      confirm spelling and leave it)
- [ ] `src/components/site-footer.tsx:258` — copyright line
- [ ] `package.json` — name is `shadcn-saas-landing`
- [ ] Logo asset: `/public/logo.png` — is it the real Aria mark?

### Tier 2 — copy rewrites, WhatsApp-native CRM angle

These need real writing, not substitution. Roughly ordered by how much of the page a
visitor reads.

- [x] `_components/hero.tsx` — done 2026-08-29. Badge, headline, subhead, both CTAs.
      Also fixed the `/chatplotdb` 404 by pointing the primary CTA at the app.
- [ ] `_components/faq.tsx` — **12 hits**, worst offender. Whole Q&A set is about
      warehouses, SQL, semantic layers, dbt/LookML
- [ ] `_components/testimonials.tsx` — **10 hits**, 12 invented testimonials about
      analyst queues and SQL. Line 127 subhead already correct for CRM
- [ ] `components/site-footer.tsx` — **5 hits**: "Folio for" nav segments, "Try Folio
      Free" CTA, description paragraph
- [ ] `_components/feature-tabs.tsx` — mixed: line 350/353 already CRM-correct, one
      Folio hit to fix
- [ ] `_components/bento.tsx`, `how-it-works.tsx` — feature claims
- [ ] `(home)/pricing/page.tsx` + `_components/pricing.tsx`, `cta.tsx` — tier names
      and per-tier feature bullets
- [ ] `(home)/contact/page.tsx` — 3 hits, plus placeholder SF address / EST hours
- [ ] `(home)/privacy/page.tsx` (4 hits) + `terms/page.tsx` (2 hits) — rewritten to
      the data-warehouse theme in `f89b3fb`; needs CRM framing (WhatsApp message data
      handling is a real privacy question here, not boilerplate)

### Tier 3 — the hero product mock

`_components/hero-dashboard/` is ~4,400 lines rendering a **fake BI product UI**:
`chat-content` (1143), `workflows-content` (1768), `reporting-content` (666),
`data-model-content` (525), `sidebar` (654), `sankey-data-card`.

It shows charts, data models and a Sankey diagram. A CRM hero should show contacts,
deals, a pipeline, and WhatsApp threads. This is the largest single item in the
conversion and deserves its own decision before anyone starts editing it.

- [ ] Decide: rebuild the mock as a CRM/WhatsApp UI, screenshot the real app instead,
      or drop the mock for a simpler hero.

### Tier 4 — hygiene

- [ ] No `.gitattributes` while `core.autocrlf=true` — binary assets churn in diffs
- [ ] `README.md` documents "Intellune", a third unrelated product
- [ ] No `.env.example`, though the README says to copy one
- [ ] Hero CTA `/chatplotdb` → 404
- [ ] Header nav anchors `#solution`, `#about` have no matching sections
- [ ] Header Login / Sign Up / Get Started all link to `#` — should point at
      `crm.realityrift.co`
- [ ] Client logo strip is 13 unrelated real companies under "Trusted by leading teams"
- [ ] Contact form submits nowhere (1s fake delay → success state)

### Tier 5 — decide keep-or-delete

Unused, still full of wrong-product copy. Each sweep pays for them.

- [ ] `_components/`: `customers`, `features`, `logo-cloud`, `product-tabs`,
      `quote-section`, `services`
- [ ] `components/`: `active-link`, `blur-image`, `docs`, `numbered-pagination`,
      `separator`
- [ ] `components/sections/header` + `footer` — second chrome implementation, reachable
      only from `not-found.tsx` and the unused `docs.tsx`
- [ ] Unused deps: drizzle + Neon, better-auth, resend + React Email, next-safe-action,
      fumadocs, `@xyflow/react`

---

## Decisions

`2026-08-29` — Target product is **Aria CRM**, not Folio. Folio was an earlier
mistaken rebrand of a bought template; all Folio-themed copy is to be rewritten, not
preserved.

`2026-08-29` — Rewrite rather than `git revert` the three copy commits: they carry
layout and structure fixes worth keeping.

`2026-08-29` — Copy deck approved as the working spec, reviewed section by section:
<https://claude.ai/code/artifact/aa3b1c13-335f-488f-824b-02dc5ae9f7c3>

`2026-08-29` — **Illustrations are off-limits, permanently.** They are template assets
the founder bought. Copy is written to fit the existing artwork, never the reverse — if
a card's picture contradicts a claim, change the claim. This also means visible text
*inside* illustrations stays wrong-product; see the open list.

`2026-08-29` — **Logo strip deferred** (founder's call). Leaving the 13 template logos
and "Trusted by leading teams" as they are for now. Still on the pre-launch list —
they are real companies who are not customers.

`2026-08-29` — Hero headline: went with "Run your whole pipeline from WhatsApp" over
the alternates in the deck. Swap is a one-line edit if it should change.

---

## Change log

`2026-08-29` — Added `CLAUDE.md` and `PROGRESS.md`. No source files touched.
`2026-08-29` — Corrected both docs after founder clarified Aria CRM is the real
product; confirmed "WhatsApp-native CRM" tagline from the app's sign-in page.
`2026-08-29` — **Section 01 Hero** copy applied (`_components/hero.tsx`): badge,
headline, subhead, both CTA labels and hrefs. Biome + `tsc --noEmit` clean. Copy only,
no markup changed.
`2026-08-29` — **FAQ** replaced wholesale from founder-supplied JSON: 20 questions in
7 groups (was 10 in 3). Pure data swap — the component maps over `faqGroups`, and the
one hardcoded id (`group.id === 'general'`, which opens the first answer) still
resolves. Biome + `tsc` clean on this file. **Open:** the section intro at line 197
still says "Folio", and the mobile category nav is a no-wrap flex row that will not fit
7 labels — needs `max-md:overflow-x-auto` or `max-md:flex-wrap`.

`2026-08-29` — **Site footer** rewritten (Option B — four columns kept, labels
rewritten). CTA, wordmark, brand blurb and copyright now Aria; email is
`support@helloaria.io`. Columns: "Connect to" (7 databases) → **Solutions**;
"Folio for" → **Aria for**; Integrations swapped from dev/data tools to
Gmail/Outlook/Calendar/Contacts/Slack/WhatsApp/Zapier/Webhooks/CSV/API; Compare
swapped from BI tools to Spreadsheets/HubSpot/Zoho/Pipedrive/Salesforce/Airtable/
Notion; "Become a partner" → **Contact** (a real route). Brand blurb reuses the
founder's own FAQ #1 wording so the two match. Biome + `tsc` clean.

`2026-08-29` — **Section 05 Feature tabs**, partial: `FOOTER_ITEMS` (the three ticked
items under the illustration) replaced with founder-supplied lines. The template's
originals were incoherent — “Static spreadsheet exports” and “SQL-only editors and BI
tools” carried green checkmarks as if they were features. Tabs, headline and subhead
still template. `tsc` clean.
`2026-08-29` — **Section 04 Bento**: card copy replaced with founder-supplied lines
(superseding my earlier pass the same day). Mapped to cards by what each illustration
actually shows:

| Card | Art | Copy |
|---|---|---|
| 1 · wide | workflow flow-builder | Your workflow, your views |
| 2 | card carousel | Companies, organized |
| 3 | converging icons | One source of truth |
| 4 | chat thread | Every interaction, connected |
| 5 | vertical timeline | Know what’s next |

Descriptions now run 38–56 chars, down from 106–208. `tsc` clean; Biome reports a
*pre-existing* format error at lines ~603–614 (carousel data array, untouched by me).

The sixth founder line (“Find it in seconds — Search, filter, and sort without digging
through spreadsheets”) had no card of its own, so its second half became the second
sentence of the wide card. All six lines are now on the page.

Final description lengths: **101** (wide) / 56 / 50 / 46 / 44. The wide card was
38 chars and read as an empty block across two columns — fixed by the merge above,
confirmed uneven by the founder in the browser first.
`2026-08-29` — **Section 03 How it works**, partial: the three `STEPS` descriptions
normalized to one shape (2 sentences, ~130 chars — was 149/134/112) so the 3-column
grid sits even. Titles, h2, section subhead and all illustrations untouched.
`tsc` clean. Biome reports one *pre-existing* format error in this file (lines ~256
and ~455, in the uncommitted work that was already here) — verified it fails
identically without my edits. Left alone rather than reformatting someone else's
in-progress code.

---

## Open questions

1. **Exact wordmark** — "Aria CRM", "AriaCRM", or "Aria"? Repeats in ~20 files;
   confirm before Tier 1.
2. **Marketing domain + social handle** — needed for `metadata.ts` and the footer.
   Is the site going on `realityrift.co`, an `aria*` domain, or something else?
3. **Positioning beyond the tagline** — what are the top 3–4 features to lead with?
   The FAQ and bento need real answers, and "WhatsApp-native" alone won't fill them.
4. **Hero mock** — see Tier 3. Rebuild, screenshot the real app, or drop it?
5. **Pricing** — real tiers and prices, or keep placeholder numbers for now?
