<div align="center">

# ⚡ TRP Powers Plus Web

**Landing page for TRP Powers Plus** — electrical systems · solar installations · online preliminary estimates

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**🌐 Language:** [ไทย](README.md) · **English**

</div>

> This project is built to be **easy to hand off** — business/portfolio data lives in one central content file, Thai/English copy is split into locale files, there's a guide for non-developer editors, and a Supabase database backs the admin panel.

---

## 📑 Table of contents

| Section | Go to |
| --- | --- |
| 🚀 Start from clone | [Getting started (step by step)](#-getting-started-step-by-step) |
| 🔑 Configure `.env.local` | [Connect Supabase](#-connect-supabase-envlocal) |
| 🗄️ Database & migrations | [Supabase database](#️-supabase-database) |
| 🧪 Local database (no prod) | [Run Supabase locally](#-run-supabase-locally-without-touching-production) |
| 📂 What to ignore / create | [Files you create yourself](#-files-you-create-yourself-never-commit) |
| 🛠️ Commands & structure | [Main commands](#️-main-commands) |
| ✏️ Edit content | [Edit text and data](#️-edit-text-and-data) |

---

## 🚀 Getting started (step by step)

> 💡 Just received the project? Follow these 5 steps top to bottom.

### 1️⃣ Install the required tools first

| Tool | Version | Download |
| --- | --- | --- |
| **Node.js** | 20+ (22 recommended) | https://nodejs.org |
| **Git** | latest | https://git-scm.com |
| **VS Code** (or other editor) | latest | https://code.visualstudio.com |

Verify everything is installed:

```bash
node --version   # should be v20+
npm --version
git --version
```

### 2️⃣ Clone the project

```bash
git clone https://github.com/Dparamet/Landing-Page-TRP-PowersPlus.git
cd Landing-Page-TRP-PowersPlus/trp-powers-plus-web
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Set up `.env.local` (important — the app won't run without it)

This file is **not in the repo** (it holds secrets). Create it from the template:

```bash
cp .env.example .env.local          # macOS / Linux
Copy-Item .env.example .env.local   # Windows PowerShell
```

Then open `.env.local` and fill in the real values from Supabase → see [Connect Supabase](#-connect-supabase-envlocal).

### 5️⃣ Start the dev server

```bash
npm run dev
```

Open your browser at **http://localhost:3000**

<details>
<summary>⚠️ Port 3000 already in use?</summary>

```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001
</details>

---

## 🔑 Connect Supabase (.env.local)

The site stores admin-edited data in Supabase, so `.env.local` needs two values:

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

### 📍 Where to find them

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → select your project
2. Menu **Project Settings → API**
3. Copy:
   - **Project URL** → into `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys → `anon` `public`** → into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ✅ The anon key is a **public** key — safe to ship in the browser because real read/write permissions are enforced by **RLS** at the database.
>
> 🚫 **Never put the `service_role` key here** — it bypasses RLS entirely.

---

## 📂 Files you create yourself (never commit)

These are **not in the repo** (they're `.gitignore`d) — each developer creates/fetches their own:

| File/folder | What it is | How you get it | Commit? |
| --- | --- | --- | --- |
| `.env.local` | Your Supabase values | Copy from `.env.example` and fill in | ❌ No |
| `.env.example` | Template for others | Ships with the repo | ✅ Yes |
| `node_modules/` | Dependencies | `npm install` | ❌ No |
| `.next/`, `out/` | Build output | `npm run build` | ❌ No |
| `backups/` | Real data dumps | `scripts/migrate-supabase.ps1` | ❌ No |
| `supabase/config.toml` | Supabase CLI local config | `supabase init` | ✅ Yes |

> 🔒 Rule: **commit only the template (`.env.example`), never files with real secrets** — `.gitignore` blocks `.env*`, `*.pem`, `*.key`, `/backups/` for you.

---

## 🗄️ Supabase database

### 📋 Tables

| Table | Stores |
| --- | --- |
| `admin_profiles` | Accounts allowed into the admin panel |
| `services` | Service listings |
| `standard_items` | Standard/product-style listings |
| `portfolio_projects` | Portfolio work |
| `portfolio_image_overrides` | Portfolio image overrides |
| `media_assets` | Images uploaded via admin |
| `faq_items` | FAQ entries |
| `process_steps` | Process/workflow steps |
| `contact_items` | Contact channels |
| `site_texts` | Miscellaneous site copy |
| `site_settings` | Site settings, e.g. logo |
| `web_events` | Visit analytics (for the dashboard) |

### 🛡️ Access control (RLS)

Every table has **Row Level Security** on — general visitors can only read published data, while edits/deletes are limited to accounts in `admin_profiles`, checked via the `is_admin(auth.uid())` function at the database. So **even if someone opens `/admin`, they can't change data without permission**.

### 🔄 How the migration system works

The database isn't saved as one big snapshot — it's described as an **ordered series of incremental steps**. Each SQL file in `supabase/migrations/` is one change, run in filename order (timestamp) from the first to the latest → producing the current DB state.

```text
202605100001_init_cms.sql            ← creates the first tables
202605100003_seed_initial_content    ← inserts sample data (seed)
        ⋮
202607040002_drop_site_text...       ← latest
```

**Three hard rules:**

1. 🚫 **Never edit a migration that already ran** — prod already applied it; editing it retroactively makes repo and prod diverge. To change something, add a new file.
2. 🕒 **New files must have a newer timestamp** (`YYYYMMDDNNNN_name.sql`) so they run at the end.
3. ♻️ **Write them to be re-runnable** (`create ... if not exists`, `drop ... if exists`).

Full list + order: [`supabase/migrations/README.md`](supabase/migrations/README.md)

**Updating the DB on production:** open the Supabase SQL Editor → open each new `.sql` file in order → copy the contents in and press Run (paste the file's contents, not the path).

### 🚚 Migrate/back up the database to another project

See the script and guide in [`docs/DB_MIGRATION.md`](docs/DB_MIGRATION.md) (uses `scripts/migrate-supabase.ps1`).

---

## 🧪 Run Supabase locally (without touching production)

Want to develop without hitting the real database? Spin up Supabase on your own machine via **Docker**.

> ✅ **Use migrations to build the local DB — no need to export from prod**, because the repo ships a seed inside a migration (`202605100003_seed_initial_content.sql`). Running them gives you both the schema and sample data.

### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (keep it running)
- [Supabase CLI](https://supabase.com/docs/guides/cli) — install: `scoop install supabase` or `choco install supabase`

### Steps

```bash
supabase init          # first time only — creates supabase/config.toml
supabase start         # brings up Postgres + Auth + API via Docker (slow first pull)
supabase db reset      # runs every migration in order + seed automatically
```

When `supabase start` finishes it prints values → put them in `.env.local` (temporarily overriding prod during dev):

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key printed by the CLI>
```

| Command | What it does |
| --- | --- |
| `supabase start` | Start the local stack |
| `supabase stop` | Stop it (when you're done) |
| `supabase db reset` | Wipe + re-run migrations (safe — it's your own DB) |
| Local Studio | http://127.0.0.1:54323 |

> ⚠️ **Note:** local Supabase uses `http://`, but the current code enforces `https://` (`src/lib/supabase/config.ts`). If you run local and hit `Supabase URL must use HTTPS`, adjust it to allow `http://127.0.0.1` for dev only.

<details>
<summary>❓ Why won't local Supabase start — checklist</summary>

| Case | Symptom | Fix |
| --- | --- | --- |
| Never ran `supabase init` | No `config.toml` | `supabase init` |
| Docker not running | `supabase start` fails | Start Docker Desktop |
| `.env.local` still points to prod | Dev but hitting prod | Swap URL/anon to local values |
| Forgot `supabase db reset` | Empty tables, query errors | `supabase db reset` |
| Port clash (54321–54324) | start fails | Kill the process or edit `config.toml` |
| HTTPS check in code | throws `must use HTTPS` | Adjust `config.ts` to allow localhost |
| Didn't restart Next | Next cached old env | Kill `npm run dev` and restart |

</details>

---

## 🛠️ Main commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm test` | Check calculation formulas, locale structure, image paths |
| `npm run lint` | Check code quality |
| `npm run build` | Build the static site into `out/` |
| `npm run start` | Next server mode (this project targets static export) |
| `npm audit --audit-level=high` | Check for high/critical vulnerabilities |

---

## 📁 Project structure

```text
trp-powers-plus-web/
├── docs/
│   ├── CONTENT_GUIDE.md   Guide for editing text and images
│   ├── HANDOFF_SPEC.md    Handoff approach and content structure
│   └── DB_MIGRATION.md    How to migrate/back up the database
├── public/images/         Logo and portfolio images
├── scripts/
│   └── migrate-supabase.ps1   Database dump/restore script
├── src/
│   ├── app/               Pages, layout, globals.css
│   ├── components/        Core UI components
│   ├── content/           Company, service, and portfolio data
│   ├── context/           Language and cookie-consent providers
│   ├── lib/               Reusable logic + supabase client
│   └── locales/           Thai/English copy
├── supabase/
│   └── migrations/        SQL files updating the database (has its own README)
├── tests/                 Test files
├── .env.example           Environment template (copy to .env.local)
├── next.config.js         Static export and image settings
└── README.md              Main guide
```

---

## ✏️ Edit text and data

Start with [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md). Key files:

| What to edit | File or folder |
| --- | --- |
| Thai copy | `src/locales/th.json` |
| English copy | `src/locales/en.json` |
| Phone, email, Line, Facebook, map | `src/content/site.ts` |
| Services / portfolio listings | `src/content/site.ts` |
| Portfolio images | `public/images/portfolio/` |
| Logo | `public/images/LogoTRP.webp` |

After editing content, run `npm test` then `npm run build`.

<details>
<summary>➕ Add a portfolio image</summary>

1. Put the image in `public/images/portfolio/`
2. Name it in English with no spaces, e.g. `factory-solar.webp`
3. Open `src/content/site.ts`, find the project
4. Point `coverImage.src` or a `gallery` image to the new path

```ts
coverImage: {
  src: '/images/portfolio/factory-solar.webp',
  alt: {
    th: 'งานติดตั้งโซลาร์เซลล์โรงงาน',
    en: 'Factory solar installation project',
  },
},
```

If the filename is wrong, `npm test` reports "image file is missing".
</details>

<details>
<summary>➕ Add a project / edit a service</summary>

Open `src/content/site.ts` and add an object to `portfolioProjects` or edit `serviceCategories`.

**Project** fields: `title`, `categoryKey` (must match `serviceCategories.key`), `category`, `description`, `systemType`, `metrics`, `location`, `province`, `accent` (`orange`/`blue`), `coverImage`, `gallery`

**Service** fields: `key`, `title`+`shortTitle`, `description`, `bestFor`, `includes` (≥3), `prepare` (≥3), `lineMessage`, `accent` (`orange`/`blue`)
</details>

---

## ☀️ Solar Calculator

| Part | File |
| --- | --- |
| UI | `src/components/SolarCalculator.tsx` |
| Formula | `src/lib/solarEstimator.ts` |
| Test | `tests/solarEstimator.test.mjs` |

Calculation basis: tiered electricity rates · Ft `0.1623 THB/unit` · 7% VAT · average generation `105/120/135 kWh per kWp per month` · rounds system size to `0.5 kWp` steps · separates On-grid / Hybrid.

> If you change rates or the formula, update the test in `tests/solarEstimator.test.mjs` to match the new behavior, then run `npm test`.

---

## ✅ Pre-handoff checks

```bash
npm test
npm run lint
npm run build
npm audit --audit-level=high
```

Expected: `npm test` all pass · `npm run lint` no errors · `npm run build` produces `out/` · `npm audit` no high/critical.

> 📝 Latest audit: `npm audit fix` resolved the fixable transitive dependencies; `postcss <8.5.10` (moderate) remains via `next` — **don't use `npm audit fix --force`**, it downgrades to `next@9.3.3` (breaking). Wait for a Next.js patch.

---

## 🔐 Security guard

- Admin login has a client-side rate limit: locks after 5 failures in 15 minutes, resets on successful login
- Supabase access uses the client SDK query builder/RPC instead of raw SQL strings
- Tests scan for `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, and raw SQL in `src/`
- `.gitignore` blocks `.env*`, `*.pem`, `*.key`, `/backups/` and allows only `.env.example`
- Security headers in `vercel.json` + `public/_headers`: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`

> ⚠️ The project uses `output: 'export'` with no Next server runtime — server-side rate limits/middleware headers must be applied by the host from `vercel.json`/`public/_headers`, and you should add extra brute-force protection at Supabase/Auth for production.

---

## ⚡ Performance guard

- The admin panel uses dynamic imports to split each manager tab, reducing hydration of unopened forms
- Public widgets (analytics, cookie UI, scroll effects) load only on non-`/admin` routes
- The partner carousel animates only near the viewport and stops on `prefers-reduced-motion`
- Scroll reveal is throttled via `requestAnimationFrame`; admin preview refresh is debounced
- The hero background uses `next/image` with `priority`, `fetchPriority="high"`, `sizes="100vw"` for LCP

Baseline before perf changes:

```bash
npm run build
Get-ChildItem -Recurse -File .next\static\chunks | Sort-Object Length -Descending | Select-Object -First 12 @{Name='KB';Expression={[math]::Round($_.Length/1KB,1)}},Name | Format-Table -AutoSize
```

---

## 🚀 Build and deploy

```bash
npm run build     # → static files in out/
```

Deploy `out/` to any static host: GitHub Pages, Netlify, Vercel static, or any HTML/CSS/JS host. If the host doesn't read `vercel.json`/`public/_headers` automatically, set equivalent security headers before going to production.

---

## 🩹 Common issues

<details>
<summary>Dev server won't start (port 3000 in use)</summary>

```bash
npm run dev -- -p 3001
```
</details>

<details>
<summary>Portfolio images don't show</summary>

Check 3 things: (1) the image is in `public/images/portfolio/` (2) the filename matches `coverImage.src`/`gallery[].src` in `src/content/site.ts` (3) the path starts with `/images/portfolio/`. Then run `npm test`.
</details>

<details>
<summary>Tests fail after editing copy</summary>

Usually keys in `th.json` / `en.json` don't match → read the error from `npm test`, add the missing key, check commas/quotes in the JSON.
</details>

<details>
<summary>Build fails on a freshly received project</summary>

```bash
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```
</details>

---

## ⚠️ Cautions

- Don't edit files in `.next/` or `out/` (they're regenerated)
- Don't commit passwords, tokens, API keys, or any secret — use `.env.example` as the template
- Don't delete tests to make commands pass
- Changing electricity rates = update the test at the same time
- Don't run `npm audit fix --force` without review (it may downgrade the framework in a breaking way)

---

## 📚 References

| In this project | External |
| --- | --- |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | [Next.js Docs](https://nextjs.org/docs) |
| [docs/HANDOFF_SPEC.md](docs/HANDOFF_SPEC.md) | [React Docs](https://react.dev) |
| [docs/DB_MIGRATION.md](docs/DB_MIGRATION.md) | [Tailwind CSS Docs](https://tailwindcss.com/docs) |
| [supabase/migrations/README.md](supabase/migrations/README.md) | [Supabase Docs](https://supabase.com/docs) |
