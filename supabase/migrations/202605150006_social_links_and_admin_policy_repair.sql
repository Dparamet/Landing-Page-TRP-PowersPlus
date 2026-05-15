alter table public.site_settings
  add column if not exists instagram_display text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists tiktok_display text not null default '',
  add column if not exists tiktok_url text not null default '';

update public.site_settings
set
  instagram_display = coalesce(nullif(instagram_display, ''), 'TRP Powers Plus'),
  instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/TRPPowersplus'),
  tiktok_display = coalesce(nullif(tiktok_display, ''), 'TRP Powers Plus'),
  tiktok_url = coalesce(nullif(tiktok_url, ''), 'https://www.tiktok.com/@TRPPowersplus')
where id = true;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles"
  on public.admin_profiles for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles"
  on public.admin_profiles for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published services" on public.services;
create policy "Anyone can read published services"
  on public.services for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets"
  on public.media_assets for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published portfolio projects" on public.portfolio_projects;
create policy "Anyone can read published portfolio projects"
  on public.portfolio_projects for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;
create policy "Admins can manage portfolio projects"
  on public.portfolio_projects for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage portfolio image overrides" on public.portfolio_image_overrides;
create policy "Admins can manage portfolio image overrides"
  on public.portfolio_image_overrides for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read portfolio image overrides" on public.portfolio_image_overrides;
create policy "Anyone can read portfolio image overrides"
  on public.portfolio_image_overrides for select
  using (deleted_at is null or public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published FAQ items" on public.faq_items;
create policy "Anyone can read published FAQ items"
  on public.faq_items for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage FAQ items" on public.faq_items;
create policy "Admins can manage FAQ items"
  on public.faq_items for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read site texts" on public.site_texts;
create policy "Anyone can read site texts"
  on public.site_texts for select
  using (deleted_at is null or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage site texts" on public.site_texts;
create policy "Admins can manage site texts"
  on public.site_texts for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published process steps" on public.process_steps;
create policy "Anyone can read published process steps"
  on public.process_steps for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage process steps" on public.process_steps;
create policy "Admins can manage process steps"
  on public.process_steps for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published contact items" on public.contact_items;
create policy "Anyone can read published contact items"
  on public.contact_items for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage contact items" on public.contact_items;
create policy "Admins can manage contact items"
  on public.contact_items for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create or replace function public.soft_delete_faq_item(item_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.faq_items
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_faq_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.faq_items
  set deleted_at = null, purge_after = null, updated_at = now()
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_faq_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.faq_items
  where id = item_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.soft_delete_process_step(step_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.process_steps
  set deleted_at = now(), purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval, updated_at = now(), published = false
  where id = step_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_process_step(step_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.process_steps
  set deleted_at = null, purge_after = null, updated_at = now()
  where id = step_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_process_step(step_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.process_steps
  where id = step_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.soft_delete_service(service_id text, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.services
  set deleted_at = now(), purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval, updated_at = now(), published = false
  where id = service_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_service(service_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.services
  set deleted_at = null, purge_after = null, updated_at = now()
  where id = service_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_service(service_id text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.services
  where id = service_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.soft_delete_contact_item(item_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contact_items
  set deleted_at = now(), purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval, updated_at = now(), published = false
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_contact_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contact_items
  set deleted_at = null, purge_after = null, updated_at = now()
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_contact_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.contact_items
  where id = item_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.soft_delete_site_text(text_key text, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_texts
  set deleted_at = now(), purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval, updated_at = now()
  where key = text_key
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_site_text(text_key text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_texts
  set deleted_at = null, purge_after = null, updated_at = now()
  where key = text_key
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_site_text(text_key text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.site_texts
  where key = text_key
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.soft_delete_portfolio_project(project_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_projects
  set deleted_at = now(), purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval, updated_at = now(), published = false
  where id = project_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_portfolio_project(project_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_projects
  set deleted_at = null, purge_after = null, updated_at = now()
  where id = project_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_portfolio_project(project_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.portfolio_projects
  where id = project_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

create or replace function public.delete_expired_portfolio_projects()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'admin privileges required';
  end if;

  delete from public.portfolio_projects
  where deleted_at is not null
    and purge_after is not null
    and purge_after <= now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

grant execute on function public.soft_delete_faq_item(uuid, integer) to authenticated;
grant execute on function public.restore_faq_item(uuid) to authenticated;
grant execute on function public.hard_delete_faq_item(uuid) to authenticated;
grant execute on function public.soft_delete_process_step(uuid, integer) to authenticated;
grant execute on function public.restore_process_step(uuid) to authenticated;
grant execute on function public.hard_delete_process_step(uuid) to authenticated;
grant execute on function public.soft_delete_service(text, integer) to authenticated;
grant execute on function public.restore_service(text) to authenticated;
grant execute on function public.hard_delete_service(text) to authenticated;
grant execute on function public.soft_delete_contact_item(uuid, integer) to authenticated;
grant execute on function public.restore_contact_item(uuid) to authenticated;
grant execute on function public.hard_delete_contact_item(uuid) to authenticated;
grant execute on function public.soft_delete_site_text(text, integer) to authenticated;
grant execute on function public.restore_site_text(text) to authenticated;
grant execute on function public.hard_delete_site_text(text) to authenticated;
grant execute on function public.soft_delete_portfolio_project(uuid, integer) to authenticated;
grant execute on function public.restore_portfolio_project(uuid) to authenticated;
grant execute on function public.hard_delete_portfolio_project(uuid) to authenticated;
grant execute on function public.delete_expired_portfolio_projects() to authenticated;

notify pgrst, 'reload schema';
