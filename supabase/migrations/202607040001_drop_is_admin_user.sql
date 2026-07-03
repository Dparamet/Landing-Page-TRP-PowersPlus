-- Consolidate admin check: web_events used is_admin_user(uuid), every other
-- table uses is_admin(uuid). They are functionally identical, so repoint the
-- web_events policies to is_admin and drop the redundant is_admin_user.

drop policy if exists "Admins can read web events" on public.web_events;
drop policy if exists "Admins can manage web events" on public.web_events;

create policy "Admins can read web events"
  on public.web_events for select
  using (public.is_admin(auth.uid()));

create policy "Admins can manage web events"
  on public.web_events for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop function if exists public.is_admin_user(uuid);
