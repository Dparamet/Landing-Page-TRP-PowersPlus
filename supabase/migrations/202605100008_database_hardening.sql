create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
  before update on public.media_assets
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_portfolio_projects_updated_at on public.portfolio_projects;
create trigger set_portfolio_projects_updated_at
  before update on public.portfolio_projects
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_portfolio_image_overrides_updated_at on public.portfolio_image_overrides;
create trigger set_portfolio_image_overrides_updated_at
  before update on public.portfolio_image_overrides
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at
  before update on public.faq_items
  for each row
  execute function public.set_updated_at();

create or replace function public.delete_expired_portfolio_projects()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  if not public.is_admin() then
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

grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.delete_expired_portfolio_projects() to authenticated;
