# CLAUDE.md

Guidance for Claude Code when working in this repository.

> **Portability note:** Sections 1 and 8 are project-specific. Sections 2–7 describe
> conventions that carry across our other Next.js projects — copy them forward, then
> rewrite 1 and 8 for the new repo.

---

## 1. What this project is

The marketing/landing site for **Aria CRM** — our own CRM product.

This is a **paid template** the founder bought (`shadcn-saas-landing`, from the
`ruixen.com` product line). It is being converted into the Aria CRM site.

### Read this before writing any copy

The template ships with copy for a product that is **not ours**, and an earlier pass
made it worse by rebranding it toward *"Folio"*, an AI data-warehouse tool. Neither
brand is the target.

| | |
|---|---|
| **Target** | Aria CRM — customer relationships, contacts, deals, pipeline, sales teams |
| **Wrong (in the repo now)** | "Folio" — SQL generation, warehouses, dashboards, BI |
| **Wrong (template default)** | generic SaaS / workflow automation |

So `Folio` is **not** a brand to preserve. All 58 occurrences across 22 files are
wrong, and — more importantly — so is the surrounding copy. The FAQ answers name
Snowflake, BigQuery, dbt and LookML. The testimonials praise generated SQL. Those are
not fixable by find-and-replace; they need rewriting as CRM claims.

**Never do a bulk `Folio` → `Aria CRM` substitution.** It produces sentences like
"Aria CRM connects to Postgres, Snowflake, and Redshift", which is worse than the
original because it reads as deliberate.

`package.json` still says `shadcn-saas-landing`; `README.md` describes a third product
("Intellune"). Both known-stale — see `PROGRESS.md`.

---

## 2. Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build (runs `next-sitemap` after) |
| `pnpm check` | Biome format + lint check — **run this before finishing** |
| `pnpm check:write` | Apply safe Biome fixes |
| `pnpm format` | Format only |
| `npx tsc --noEmit` | Typecheck (there is no dedicated script) |

Package manager is **pnpm 10.7**. Do not use npm or yarn — the lockfile is
`pnpm-lock.yaml`.

Env validation runs at build via `src/env.js` (`@t3-oss/env-nextjs`). Set
`SKIP_ENV_VALIDATION=1` to bypass. Only `NEXT_PUBLIC_APP_URL` is defined, and it is
optional — the app currently runs with **no `.env` file at all**.

---

## 3. Architecture

Next.js 15 App Router, React 19, Tailwind CSS 4 (CSS-first config, **no
`tailwind.config`**), shadcn/ui "new-york" style with `zinc` base.

```
src/
  app/
    layout.tsx          Root: fonts, metadata, icons, viewport
    layout.client.tsx   <body> wrapper (client — reads route params)
    layout.config.tsx   Brand name, description, nav link items  <- EDIT FOR BRANDING
    provider.tsx        Theme + fumadocs + progress bar + tooltip + toaster providers
    not-found.tsx
    (home)/
      layout.tsx        HeroHeader + <main> + SiteFooter
      page.tsx          Landing page — composes the sections, owns the client logo list
      _components/      Page-specific sections (not shared)
        hero-dashboard/ Fake product UI shown inside the hero
      contact/  pricing/  privacy/  terms/
  components/
    ui/                 shadcn primitives — regenerable, avoid hand-editing
    sections/           header/ + footer/ (used only by not-found + docs)
    icons/              Icon set + animated icons
    hero-header.tsx     The header the live site actually uses
    site-footer.tsx     The footer the live site actually uses
  lib/                  cn(), metadata factory, constants, isActive, zod validators
  hooks/
  styles/globals.css    Design tokens, fonts, keyframes, custom utilities (625 lines)
```

### Routing reality

Only these routes exist: `/`, `/contact`, `/pricing`, `/privacy`, `/terms`.

There are **two header and two footer implementations**. `(home)/layout.tsx` uses
`components/hero-header.tsx` and `components/site-footer.tsx`. The
`components/sections/header|footer` pair is only reachable from `not-found.tsx` and
`components/docs.tsx`. When changing site chrome, edit the `hero-header` /
`site-footer` pair unless you specifically mean the 404 page.

### What is installed but NOT used

`drizzle-orm` + Neon, `better-auth`, `resend` + React Email, `next-safe-action`,
`fumadocs` content pipeline, `@xyflow/react`, `recharts` (partly).

There are **zero** `'use server'` actions, zero API routes, zero database calls. This
is a fully static marketing site. The contact form in `src/app/(home)/contact/page.tsx`
fakes submission with a 1-second `setTimeout` — it sends nothing. Zod schemas exist in
`src/lib/validators/` but nothing imports them.

Do not assume a backend exists. If a task needs one, say so before building it.

---

## 4. Coding style — match it, do not "improve" it

Biome enforces most of this (`biome.jsonc`). **Never** reformat a file you are not
otherwise changing, and never run `check:unsafe` / `lint:unsafe` across the repo.

- **Single quotes** in JS *and* JSX (`className='...'`, not `"..."`). This is unusual;
  it is deliberate.
- 2-space indent, semicolons always.
- Imports are auto-sorted by Biome — let it sort; do not hand-order.
- Type-only imports use `import type { X } from 'y'` (`verbatimModuleSyntax` is on).
- Path alias `@/*` maps to `src/*`, `@/public/*` to `public/*`. Use it for
  cross-directory imports; use relative paths inside `_components/`.
- Tailwind classes are auto-sorted by Biome's `useSortedClasses` for `cn`, `clsx`,
  `cva`. Sorted output looks scrambled (`'-bottom-3 -left-3 absolute'`) — that is
  correct, leave it.

### Component conventions

Both of these appear and both are fine — **match the file you are editing**:

```tsx
// Arrow + default export (hero.tsx, section.tsx, layouts)
const Hero = () => { ... };
export default Hero;

// Function declaration + named export (hero-header.tsx, ui/*)
export function HeroHeader() { ... }
```

- Section components in `_components/` are default-exported.
- Shared components in `components/` are named-exported.
- Props are typed inline or with a local `type`/`interface` — no shared props file.
- `'use client'` only where hooks/events are needed (39 of 85 `.tsx` files). Sections
  that are pure markup stay server components.
- Content (testimonials, FAQ items, pricing tiers, nav items) lives in a
  **module-scope `const` array above the component**, typed, then mapped over. Keep new
  content in that same shape rather than inventing a data layer.
- shadcn primitives use `cva` + `data-slot` attributes + `React.ComponentProps<'x'>`.
  Follow `ui/button.tsx` as the reference.

---

## 5. Design system

- **Colors** are fumadocs CSS variables (`--color-fd-*`) remapped into Tailwind theme
  tokens in `globals.css`. Use semantic classes — `bg-background`, `text-foreground`,
  `text-muted-foreground`, `border-border`. **Do not hardcode hex or `zinc-800`-style
  palette classes** in new markup.
- Dark mode is class-based (`.dark`, `next-themes`, `attribute='class'`). Every token
  has a `.dark` counterpart; new tokens must too.
- **Fonts:** Geist Sans / Geist Mono via `next/font` (`--font-geist-sans`,
  `--font-geist-mono`), plus **Tiempos Headline** (local `.otf`, `--font-tiempos`)
  applied automatically to `h1` and `h2` in `globals.css`.
- Accent color `--color-ai-sparkle: #138dff` for AI-flavored UI.
- `<Section>` (`components/section.tsx`) gives the bordered container with the corner
  `+` crosses. Reuse it for new full-width sections.
- Animations: Framer Motion / `motion` for interaction; plain CSS keyframes in
  `globals.css` for ambient effects. `prefers-reduced-motion` is already handled there
  — extend that block when adding animation.
- The `container` utility is custom (`@utility container`, max 1400px at 2xl) — it is
  not Tailwind's default container.

---

## 6. How to make changes

**Atomic changes only.** One concern per change.

1. Read the target file first. Match its local style over anything in this document.
2. Change only what was asked. No drive-by refactors, no renames, no reformatting, no
   "while I'm here" fixes. If you spot something else wrong, note it in `PROGRESS.md`
   and mention it — do not fix it unsolicited.
3. Prefer editing existing components over adding new ones.
4. Keep public exports and component signatures stable.
5. Verify with `pnpm check` and `npx tsc --noEmit`.
6. Log the change in `PROGRESS.md`.

**Copy changes are the common task here.** Most work on this repo is replacing
template copy with real Folio copy. Those are string-only edits — do not restructure
markup while doing them.

---

## 7. Gotchas

- **`core.autocrlf=true` and there is no `.gitattributes`.** Git currently reports the
  four `public/fonts/TiemposHeadline-*.otf` binaries as modified with identical byte
  counts. Add a `.gitattributes` before committing binary assets, or line endings will
  keep churning the diff.
- Tailwind 4 has no config file. Theme changes go in `globals.css` under `@theme`.
- `next.config.js` allows remote images only from `images.unsplash.com`,
  `res.cloudinary.com`, `avatars.githubusercontent.com`. New remote hosts must be added
  there or `next/image` throws.
- `page.tsx` uses raw `<img>` for the client logos (not `next/image`) — intentional,
  they are inline SVGs from `/public/logos/`.
- `tsconfig` has `noUncheckedIndexedAccess: true` — array indexing yields
  `T | undefined`. Guard it.

---

## 8. The product we are actually selling

**Aria CRM — a WhatsApp-native CRM.**
App: <https://crm.realityrift.co/> (auth-gated; workspaces are on
`*.crm.realityrift.co` subdomains). Brand and tagline confirmed from the sign-in page.

"WhatsApp-native" is the differentiator and should drive the copy. The nearest true
statements in the repo right now are the surviving template lines:

> "Stop managing customer relationships across scattered spreadsheets and tools. Aria
> keeps your customer data, activity, and workflow connected in one place."
> — `feature-tabs.tsx:353`

Those are **correct in theme** and should be treated as the reference voice, not as
residue to be swept.

Anything framed around SQL, warehouses, dashboards, BI or "asking your data questions"
is off-product and needs replacing. See `PROGRESS.md` for the file-by-file backlog.

### Still open

- Exact wordmark: "Aria CRM" vs "AriaCRM" vs "Aria" — confirm before mass edits.
- Real marketing domain, social handle, and GitHub org (`layout.config.tsx` still
  points at `github.com/ruixenui/ruixen.com`).
- Hero CTA links to `/chatplotdb`, not a route → 404.
- Header nav links to `#features`, `#solution`, `#pricing`, `#about`; only some of
  those anchors exist.
- `package.json` name is `shadcn-saas-landing`; `README.md` describes "Intellune".
- Unused files still carrying template copy: `_components/` — `customers`, `features`,
  `logo-cloud`, `product-tabs`, `quote-section`, `services`; `components/` —
  `active-link`, `blur-image`, `docs`, `numbered-pagination`, `separator`. Decide
  keep-or-delete; every sweep pays for them.
