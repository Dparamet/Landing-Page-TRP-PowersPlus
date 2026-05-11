create extension if not exists "pgcrypto";

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  name text not null default 'TRP Powers Plus',
  phone_display text not null default '',
  phone_href text not null default '',
  email text not null default '',
  line_id text not null default '',
  line_url text not null default '',
  facebook_display text not null default '',
  facebook_url text not null default '',
  address text not null default '',
  google_maps_search_url text not null default '',
  google_maps_embed_url text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id text primary key,
  title jsonb not null,
  short_title jsonb not null,
  description jsonb not null,
  best_for jsonb not null,
  includes jsonb not null default '[]'::jsonb,
  prepare jsonb not null default '[]'::jsonb,
  line_message jsonb not null,
  accent text not null default 'blue' check (accent in ('orange', 'blue')),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null unique,
  public_url text not null,
  alt_th text not null default '',
  alt_en text not null default '',
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_key text not null references public.services(id),
  title jsonb not null,
  description jsonb not null,
  system_type jsonb not null,
  metrics jsonb not null default '[]'::jsonb,
  location jsonb not null,
  accent text not null default 'blue' check (accent in ('orange', 'blue')),
  cover_image_id uuid references public.media_assets(id) on delete set null,
  gallery jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.media_assets enable row level security;
alter table public.portfolio_projects enable row level security;

create policy "Admins can read admin profiles"
  on public.admin_profiles for select
  using (public.is_admin());

create policy "Admins can manage admin profiles"
  on public.admin_profiles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

create policy "Anyone can read published services"
  on public.services for select
  using (published = true or public.is_admin());

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

create policy "Anyone can read media assets"
  on public.media_assets for select
  using (true);

create policy "Admins can manage media assets"
  on public.media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.media_assets to anon, authenticated;
grant insert, update, delete on public.media_assets to authenticated;

create policy "Anyone can read published portfolio projects"
  on public.portfolio_projects for select
  using (published = true or public.is_admin());

create policy "Admins can manage portfolio projects"
  on public.portfolio_projects for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.portfolio_projects to anon, authenticated;
grant insert, update, delete on public.portfolio_projects to authenticated;

grant select on public.admin_profiles to authenticated;

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;
