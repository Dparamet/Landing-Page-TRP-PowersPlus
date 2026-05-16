alter table public.standard_items
  alter column id type text using id::text;

alter table public.standard_items
  drop constraint if exists standard_items_id_slug_check;

alter table public.standard_items
  add constraint standard_items_id_slug_check check (id ~ '^[a-z0-9-]+$');

drop function if exists public.soft_delete_standard_item(uuid, integer);
drop function if exists public.restore_standard_item(uuid);
drop function if exists public.hard_delete_standard_item(uuid);

create or replace function public.soft_delete_standard_item(item_id text, retention_days integer default 30)
returns void
language sql
security definer
set search_path = public
as $$
  update public.standard_items
  set
    deleted_at = now(),
    purge_after = now() + (least(greatest(retention_days, 7), 30) || ' days')::interval,
    updated_at = now(),
    published = false
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.restore_standard_item(item_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.standard_items
  set
    deleted_at = null,
    purge_after = null,
    updated_at = now()
  where id = item_id
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_standard_item(item_id text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.standard_items
  where id = item_id
    and deleted_at is not null
    and public.is_admin(auth.uid());
$$;

grant execute on function public.soft_delete_standard_item(text, integer) to authenticated;
grant execute on function public.restore_standard_item(text) to authenticated;
grant execute on function public.hard_delete_standard_item(text) to authenticated;

notify pgrst, 'reload schema';
