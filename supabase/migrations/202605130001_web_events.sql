create table if not exists public.web_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view', 'click', 'form_submit')),
  page_url text not null,
  path text not null,
  referrer text,
  element_tag text,
  element_text text,
  element_id text,
  element_href text,
  form_id text,
  form_name text,
  form_action text,
  session_id uuid,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.web_events enable row level security;

create or replace function public.is_admin_user(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = is_admin_user.user_id
  );
$$;

grant execute on function public.is_admin_user(uuid) to anon, authenticated;

create policy "Anyone can insert web events"
  on public.web_events for insert
  with check (true);

create policy "Admins can read web events"
  on public.web_events for select
  using (public.is_admin_user(auth.uid()));

create policy "Admins can manage web events"
  on public.web_events for all
  using (public.is_admin_user(auth.uid()))
  with check (public.is_admin_user(auth.uid()));

grant insert on public.web_events to anon, authenticated;
grant select on public.web_events to authenticated;

create index if not exists web_events_created_at_idx on public.web_events (created_at desc);
create index if not exists web_events_event_type_idx on public.web_events (event_type);
create index if not exists web_events_path_idx on public.web_events (path);
create index if not exists web_events_session_id_idx on public.web_events (session_id);
