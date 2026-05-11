# Spec: Client CMS Database Refactor

## Assumptions
- App: Next.js 16 + React 19 + Supabase.
- Database: Supabase PostgreSQL with RLS.
- Admin users already come from `admin_profiles`.
- Goal is CMS CRUD for customer-facing sections shown in screenshots, not a full CRM.
- Before applying DB migration to live Supabase, export backup or use Supabase project backup.

## Objective
Refactor content data so admin can manage these sections without code edits:

- Services: CRUD all service cards and service selector data.
- Service selector: CRUD "เหมาะกับ", "งานที่รับ", "ข้อมูลที่ควรเตรียม", LINE message.
- Portfolio: CRUD projects, metrics, cover image, gallery images, publish/delete/restore.
- Contact: CRUD contact items and editable map/company settings.

Success means the public page renders only published/non-deleted content from CMS with static fallback only when Supabase env is missing.

## Tech Stack
- Next.js `16.2.4`
- React `19.2.4`
- Supabase JS `^2.105.4`
- TypeScript `^5`
- Tests: Node test runner via `node --test tests/*.test.mjs`

## Commands
Dev:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Lint:
```bash
npm run lint
```

Test:
```bash
npm test
```

DB verification:
```bash
npm test -- tests/migrations.test.mjs
```

## Project Structure
- `src/components/*` -> public UI sections.
- `src/components/admin/*` -> admin CMS managers.
- `src/hooks/*` -> public Supabase loaders with fallback.
- `src/lib/admin/*` -> validation and DB mapping helpers.
- `src/lib/supabase/database.types.ts` -> generated/manual Supabase types.
- `supabase/migrations/*` -> schema changes.
- `tests/*.test.mjs` -> unit/schema guard tests.

## Current Findings
- `services` table has `includes` and `prepare`, but `ServiceManager` does not edit them; `mapServiceFormToUpsert()` keeps fallback arrays.
- `ServiceSelector` uses `bestFor`, `includes`, `prepare`; missing admin editing causes screenshot 2 data gap.
- `PortfolioPostManager` supports create + soft delete/restore/hard delete, but not full edit/update for existing posts.
- `portfolio_projects.gallery` exists, but new DB portfolio posts map to default logo gallery; image override manager targets static project keys and does not naturally manage DB project gallery.
- Portfolio cards/detail use `object-contain p-8/p-6`, causing visible background and non-full images.
- There is no image lightbox/modal for additional portfolio photos.
- `site_settings` supports one company/contact settings row, but screenshot contact list is not item-level CRUD.
- `Contact` builds contact items in code from `companyProfile`; admin cannot reorder/hide/add contact methods.

## Proposed Data Model

### Existing tables to extend
`services`
- Keep `id`, localized title fields, `best_for`, `includes`, `prepare`, `line_message`, `published`, `deleted_at`.
- Admin must edit list fields as repeatable localized items.

`portfolio_projects`
- Keep existing fields.
- Use `cover_image_id` for cover image.
- Replace loose/default gallery usage with managed gallery rows or normalized table.

`site_settings`
- Keep as single company/map settings record.
- Add only if needed: `logo_asset_id`.

### New table: `portfolio_project_images`
Purpose: CRUD multiple images per project.

Fields:
- `id uuid primary key`
- `project_id uuid references portfolio_projects(id) on delete cascade`
- `media_asset_id uuid references media_assets(id) on delete set null`
- `image_url text not null`
- `alt jsonb not null`
- `caption jsonb not null`
- `stage text check (stage in ('cover','before','during','after','other'))`
- `sort_order integer not null default 0`
- `published boolean not null default true`
- `deleted_at timestamptz`
- `purge_after timestamptz`
- timestamps

### New table: `contact_items`
Purpose: CRUD rows shown in Contact card.

Fields:
- `id uuid primary key`
- `type text not null`
- `icon text not null`
- `label jsonb not null`
- `value jsonb not null`
- `href text`
- `copy_value text`
- `external boolean not null default false`
- `sort_order integer not null default 0`
- `published boolean not null default true`
- `deleted_at timestamptz`
- `purge_after timestamptz`
- timestamps

## Boundaries
- Always: use RLS with `public.is_admin()` for writes.
- Always: soft delete first; hard delete only for records already in trash.
- Always: run `npm test` and `npm run build` before handoff.
- Ask first: applying migrations to production Supabase.
- Ask first: deleting existing live content permanently.
- Never: commit `.env.local`, Supabase keys, service role keys, or customer private data.

## Safe DB Process
Backup first:
```bash
supabase db dump --file backup-before-client-cms-refactor.sql
```

Apply migration only after review:
```bash
supabase db push
```

Rollback strategy:
- Use Supabase backup restore for destructive failure.
- Keep migrations additive first: create tables/columns before deleting legacy paths.
- Do not drop existing columns until public/admin UI is verified.

Verification:
```bash
npm test
npm run build
```

## Success Criteria
- Admin can create, edit, publish/unpublish, soft-delete, restore, hard-delete services.
- Admin can edit service `best_for`, `includes`, `prepare`, and `line_message`.
- Public service cards and selector update from DB without code edit.
- Admin can create and edit existing portfolio projects.
- Admin can set cover image and multiple gallery images per project.
- Portfolio images fill their frames without blue padding/background issue.
- User can click portfolio images to view larger gallery/lightbox.
- Admin can CRUD contact rows: company, phone, LINE, Facebook, email, address, or custom.
- Contact map/company settings remain editable.
- Tests cover mapping/validation/migration names for new CMS tables.

## Implementation Plan

### Phase 1: DB contract
- Add migration for `portfolio_project_images` and `contact_items`.
- Add RLS, grants, soft-delete/restore/hard-delete RPCs.
- Update `src/lib/supabase/database.types.ts`.

Checkpoint:
- `npm test -- tests/migrations.test.mjs`

### Phase 2: Services CRUD completion
- Extend `ServiceFormValues` for repeatable `includes` and `prepare`.
- Update `ServiceManager` UI to add/remove/edit list rows in TH/EN.
- Update tests in `tests/servicesAdmin.test.mjs`.

Checkpoint:
- `npm test -- tests/servicesAdmin.test.mjs`

### Phase 3: Portfolio CRUD completion
- Add edit mode in `PortfolioPostManager`.
- Support update existing project, slug/sort order, metrics list, cover image.
- Add `PortfolioGalleryManager` or merge gallery CRUD into post manager.
- Replace static-key image override path for DB projects with `project_id` gallery rows.

Checkpoint:
- `npm test -- tests/portfolioPosts.test.mjs`

### Phase 4: Public portfolio UX
- Update `usePortfolioProjects()` to load project images.
- Change image classes from contained logo-style display to full image display.
- Add image lightbox for cover/gallery.
- Keep accessible alt/caption text.

Checkpoint:
- Manual browser check desktop/mobile for portfolio.
- `npm run build`

### Phase 5: Contact CRUD
- Add `contact_items` admin manager.
- Add `useContactItems()` hook.
- Update `Contact` to render DB contact rows with fallback.
- Keep `CompanySettingsForm` for map/company-level settings.

Checkpoint:
- `npm test -- tests/companySettings.test.mjs`
- Add `tests/contactItems.test.mjs`

### Phase 6: Final hardening
- Validate RLS and admin-only writes.
- Confirm deleted content does not render publicly.
- Run full verification.

Final verification:
```bash
npm test
npm run lint
npm run build
```

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Migration affects live content | High | Backup first, additive migration, no column drop |
| Static fallback duplicates DB content | Medium | Deduplicate by `id`/`slug`, prefer DB rows |
| Portfolio image relation complexity | Medium | Normalize images by `project_id`, keep old override until cutover verified |
| Contact item URLs unsafe | Medium | Validate `https://`, `mailto:`, `tel:`, and LINE URL patterns |
| Admin UI grows too dense | Medium | Split managers into tabs/sections after DB contract is stable |

## Open Questions
- ต้องการให้ static content เดิมยังแสดงคู่กับ DB content หรือให้ DB override ทั้งหมด?
- Contact item แบบ custom ต้องรองรับ icon อะไรบ้าง?
- Portfolio หนึ่งโปรเจกต์ต้องรองรับรูปสูงสุดกี่รูป?
- ต้องการเก็บ `portfolio_image_overrides` ต่อเพื่อ override งาน static เดิม หรือ migrate ไป `portfolio_project_images` ทั้งหมด?
