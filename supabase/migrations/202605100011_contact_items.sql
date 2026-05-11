create table if not exists public.contact_items (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  icon text not null default 'custom',
  label jsonb not null,
  value jsonb not null,
  href text,
  copy_value text,
  external boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  deleted_at timestamptz,
  purge_after timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.contact_items enable row level security;

drop policy if exists "Anyone can read published contact items" on public.contact_items;
drop policy if exists "Admins can manage contact items" on public.contact_items;

create policy "Anyone can read published contact items"
  on public.contact_items for select
  using ((published = true and deleted_at is null) or public.is_admin());

create policy "Admins can manage contact items"
  on public.contact_items for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.contact_items to anon, authenticated;
grant insert, update on public.contact_items to authenticated;

drop trigger if exists set_contact_items_updated_at on public.contact_items;
create trigger set_contact_items_updated_at
  before update on public.contact_items
  for each row
  execute function public.set_updated_at();

create or replace function public.soft_delete_contact_item(item_id uuid, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contact_items
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = item_id
    and public.is_admin();
$$;

create or replace function public.restore_contact_item(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contact_items
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = item_id
    and public.is_admin();
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
    and public.is_admin();
$$;

grant execute on function public.soft_delete_contact_item(uuid, integer) to authenticated;
grant execute on function public.restore_contact_item(uuid) to authenticated;
grant execute on function public.hard_delete_contact_item(uuid) to authenticated;

revoke delete on public.contact_items from authenticated;
