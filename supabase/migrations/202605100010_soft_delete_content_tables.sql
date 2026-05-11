alter table public.faq_items
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

alter table public.process_steps
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

alter table public.site_texts
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

alter table public.portfolio_image_overrides
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

alter table public.services
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

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
    and public.is_admin();
$$;

create or replace function public.restore_faq_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.faq_items
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = item_id
    and public.is_admin();
$$;

create or replace function public.soft_delete_process_step(step_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.process_steps
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = step_id
    and public.is_admin();
$$;

create or replace function public.restore_process_step(step_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.process_steps
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = step_id
    and public.is_admin();
$$;

create or replace function public.soft_delete_site_text(text_key text, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_texts
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now()
  where key = text_key
    and public.is_admin();
$$;

create or replace function public.restore_site_text(text_key text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_texts
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where key = text_key
    and public.is_admin();
$$;

create or replace function public.soft_delete_portfolio_image_override(
  override_project_key text,
  override_image_slot text,
  retention_days integer default 30
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_image_overrides
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now()
  where project_key = override_project_key
    and image_slot = override_image_slot
    and public.is_admin();
$$;

create or replace function public.restore_portfolio_image_override(
  override_project_key text,
  override_image_slot text
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_image_overrides
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where project_key = override_project_key
    and image_slot = override_image_slot
    and public.is_admin();
$$;

create or replace function public.soft_delete_service(service_id text, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.services
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = service_id
    and public.is_admin();
$$;

create or replace function public.restore_service(service_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.services
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = service_id
    and public.is_admin();
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
    and public.is_admin();
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
    and public.is_admin();
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
    and public.is_admin();
$$;

create or replace function public.hard_delete_portfolio_image_override(
  override_project_key text,
  override_image_slot text
)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.portfolio_image_overrides
  where project_key = override_project_key
    and image_slot = override_image_slot
    and deleted_at is not null
    and public.is_admin();
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
    and public.is_admin();
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
    and public.is_admin();
$$;

grant execute on function public.soft_delete_faq_item(uuid, integer) to authenticated;
grant execute on function public.restore_faq_item(uuid) to authenticated;
grant execute on function public.soft_delete_process_step(uuid, integer) to authenticated;
grant execute on function public.restore_process_step(uuid) to authenticated;
grant execute on function public.soft_delete_site_text(text, integer) to authenticated;
grant execute on function public.restore_site_text(text) to authenticated;
grant execute on function public.soft_delete_portfolio_image_override(text, text, integer) to authenticated;
grant execute on function public.restore_portfolio_image_override(text, text) to authenticated;
grant execute on function public.soft_delete_service(text, integer) to authenticated;
grant execute on function public.restore_service(text) to authenticated;
grant execute on function public.hard_delete_faq_item(uuid) to authenticated;
grant execute on function public.hard_delete_process_step(uuid) to authenticated;
grant execute on function public.hard_delete_site_text(text) to authenticated;
grant execute on function public.hard_delete_portfolio_image_override(text, text) to authenticated;
grant execute on function public.hard_delete_portfolio_project(uuid) to authenticated;
grant execute on function public.hard_delete_service(text) to authenticated;

revoke delete on public.faq_items from authenticated;
revoke delete on public.process_steps from authenticated;
revoke delete on public.site_texts from authenticated;
revoke delete on public.portfolio_image_overrides from authenticated;
revoke delete on public.portfolio_projects from authenticated;
revoke delete on public.services from authenticated;

drop policy if exists "Anyone can read published FAQ items" on public.faq_items;
create policy "Anyone can read published FAQ items"
  on public.faq_items for select
  using ((published = true and deleted_at is null) or public.is_admin());

drop policy if exists "Anyone can read published process steps" on public.process_steps;
create policy "Anyone can read published process steps"
  on public.process_steps for select
  using ((published = true and deleted_at is null) or public.is_admin());

drop policy if exists "Anyone can read site texts" on public.site_texts;
create policy "Anyone can read site texts"
  on public.site_texts for select
  using (deleted_at is null or public.is_admin());

drop policy if exists "Anyone can read portfolio image overrides" on public.portfolio_image_overrides;
create policy "Anyone can read portfolio image overrides"
  on public.portfolio_image_overrides for select
  using (deleted_at is null or public.is_admin());

drop policy if exists "Anyone can read published services" on public.services;
create policy "Anyone can read published services"
  on public.services for select
  using ((published = true and deleted_at is null) or public.is_admin());
