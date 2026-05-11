create table if not exists public.portfolio_image_overrides (
  project_key text not null,
  image_slot text not null check (image_slot in ('cover', 'before', 'during', 'after')),
  image_url text not null,
  alt_th text not null default '',
  media_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (project_key, image_slot)
);

alter table public.portfolio_image_overrides enable row level security;

drop policy if exists "Anyone can read portfolio image overrides" on public.portfolio_image_overrides;
drop policy if exists "Admins can manage portfolio image overrides" on public.portfolio_image_overrides;

create policy "Anyone can read portfolio image overrides"
  on public.portfolio_image_overrides for select
  using (true);

create policy "Admins can manage portfolio image overrides"
  on public.portfolio_image_overrides for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.portfolio_image_overrides to anon, authenticated;
grant insert, update, delete on public.portfolio_image_overrides to authenticated;
