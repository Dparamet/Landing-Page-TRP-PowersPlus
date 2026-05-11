grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.media_assets enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;
drop policy if exists "Anyone can read published services" on public.services;
drop policy if exists "Admins can manage services" on public.services;
drop policy if exists "Anyone can read media assets" on public.media_assets;
drop policy if exists "Admins can manage media assets" on public.media_assets;
drop policy if exists "Anyone can read published portfolio projects" on public.portfolio_projects;
drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;

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

create policy "Anyone can read published services"
  on public.services for select
  using (published = true or public.is_admin());

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read media assets"
  on public.media_assets for select
  using (true);

create policy "Admins can manage media assets"
  on public.media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read published portfolio projects"
  on public.portfolio_projects for select
  using (published = true or public.is_admin());

create policy "Admins can manage portfolio projects"
  on public.portfolio_projects for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.admin_profiles to authenticated;

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

grant select on public.media_assets to anon, authenticated;
grant insert, update, delete on public.media_assets to authenticated;

grant select on public.portfolio_projects to anon, authenticated;
grant insert, update, delete on public.portfolio_projects to authenticated;
