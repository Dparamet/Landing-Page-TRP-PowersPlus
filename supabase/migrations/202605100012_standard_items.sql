create table if not exists public.standard_items (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  title text not null,
  image_url text,
  alt_text text not null default '',
  media_asset_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz,
  purge_after timestamptz
);

alter table public.standard_items enable row level security;

drop policy if exists "Anyone can read published standard items" on public.standard_items;
drop policy if exists "Admins can manage standard items" on public.standard_items;

create policy "Anyone can read published standard items"
  on public.standard_items for select
  using ((published = true and deleted_at is null) or public.is_admin());

create policy "Admins can manage standard items"
  on public.standard_items for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.standard_items to anon, authenticated;
grant insert, update on public.standard_items to authenticated;

insert into public.standard_items (id, title, sort_order, published)
values
  ('well', 'WELL', 10, true),
  ('trees', 'TREES', 20, true),
  ('ansi', 'ANSI', 30, true),
  ('leed', 'LEED', 40, true),
  ('green-industry', 'Green Industry', 50, true),
  ('iso-14001', 'ISO 14001', 60, true)
on conflict (id) do nothing;

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
    and public.is_admin();
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
    and public.is_admin();
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
    and public.is_admin();
$$;

grant execute on function public.soft_delete_standard_item(text, integer) to authenticated;
grant execute on function public.restore_standard_item(text) to authenticated;
grant execute on function public.hard_delete_standard_item(text) to authenticated;
revoke delete on public.standard_items from authenticated;
