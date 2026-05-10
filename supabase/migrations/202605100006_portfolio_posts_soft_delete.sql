alter table public.portfolio_projects
  add column if not exists deleted_at timestamptz,
  add column if not exists purge_after timestamptz;

create or replace function public.soft_delete_portfolio_project(project_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_projects
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = project_id
    and public.is_admin();
$$;

create or replace function public.restore_portfolio_project(project_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.portfolio_projects
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = project_id
    and public.is_admin();
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
  delete from public.portfolio_projects
  where deleted_at is not null
    and purge_after is not null
    and purge_after <= now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

grant execute on function public.soft_delete_portfolio_project(uuid, integer) to authenticated;
grant execute on function public.restore_portfolio_project(uuid) to authenticated;
grant execute on function public.delete_expired_portfolio_projects() to authenticated;

drop policy if exists "Anyone can read published portfolio projects" on public.portfolio_projects;

create policy "Anyone can read published portfolio projects"
  on public.portfolio_projects for select
  using ((published = true and deleted_at is null) or public.is_admin());
