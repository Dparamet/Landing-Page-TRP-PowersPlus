create or replace function public.is_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = is_admin.p_user_id
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

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
    and public.is_admin(auth.uid());
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
    and public.is_admin(auth.uid());
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
    and public.is_admin(auth.uid());
$$;

create or replace function public.hard_delete_media_asset(asset_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    return;
  end if;

  delete from public.portfolio_image_overrides
  where media_asset_id = asset_id;

  update public.portfolio_projects
  set
    cover_image_id = null,
    updated_at = now()
  where cover_image_id = asset_id;

  delete from public.media_assets
  where id = asset_id;
end;
$$;

grant execute on function public.soft_delete_portfolio_image_override(text, text, integer) to authenticated;
grant execute on function public.restore_portfolio_image_override(text, text) to authenticated;
grant execute on function public.hard_delete_portfolio_image_override(text, text) to authenticated;
grant execute on function public.hard_delete_media_asset(uuid) to authenticated;

drop policy if exists "Anyone can read portfolio image overrides" on public.portfolio_image_overrides;
drop policy if exists admin_select on public.portfolio_image_overrides;
create policy "Anyone can read portfolio image overrides"
  on public.portfolio_image_overrides for select
  using (deleted_at is null or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage portfolio image overrides" on public.portfolio_image_overrides;
drop policy if exists admin_insert on public.portfolio_image_overrides;
drop policy if exists admin_update on public.portfolio_image_overrides;
drop policy if exists admin_delete on public.portfolio_image_overrides;
create policy "Admins can manage portfolio image overrides"
  on public.portfolio_image_overrides for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read media assets" on public.media_assets;
drop policy if exists admin_select on public.media_assets;
create policy "Anyone can read media assets"
  on public.media_assets for select
  using (true);

drop policy if exists "Admins can manage media assets" on public.media_assets;
drop policy if exists admin_insert on public.media_assets;
drop policy if exists admin_update on public.media_assets;
drop policy if exists admin_delete on public.media_assets;
create policy "Admins can manage media assets"
  on public.media_assets for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read site texts" on public.site_texts;
drop policy if exists admin_select on public.site_texts;
create policy "Anyone can read site texts"
  on public.site_texts for select
  using (deleted_at is null or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage site texts" on public.site_texts;
drop policy if exists admin_insert on public.site_texts;
drop policy if exists admin_update on public.site_texts;
drop policy if exists admin_delete on public.site_texts;
create policy "Admins can manage site texts"
  on public.site_texts for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published portfolio projects" on public.portfolio_projects;
drop policy if exists admin_select on public.portfolio_projects;
create policy "Anyone can read published portfolio projects"
  on public.portfolio_projects for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;
drop policy if exists admin_insert on public.portfolio_projects;
drop policy if exists admin_update on public.portfolio_projects;
drop policy if exists admin_delete on public.portfolio_projects;
create policy "Admins can manage portfolio projects"
  on public.portfolio_projects for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published services" on public.services;
drop policy if exists admin_select on public.services;
create policy "Anyone can read published services"
  on public.services for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage services" on public.services;
drop policy if exists admin_insert on public.services;
drop policy if exists admin_update on public.services;
drop policy if exists admin_delete on public.services;
create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published process steps" on public.process_steps;
drop policy if exists admin_select on public.process_steps;
create policy "Anyone can read published process steps"
  on public.process_steps for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage process steps" on public.process_steps;
drop policy if exists admin_insert on public.process_steps;
drop policy if exists admin_update on public.process_steps;
drop policy if exists admin_delete on public.process_steps;
create policy "Admins can manage process steps"
  on public.process_steps for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published FAQ items" on public.faq_items;
drop policy if exists admin_select on public.faq_items;
create policy "Anyone can read published FAQ items"
  on public.faq_items for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage FAQ items" on public.faq_items;
drop policy if exists admin_insert on public.faq_items;
drop policy if exists admin_update on public.faq_items;
drop policy if exists admin_delete on public.faq_items;
create policy "Admins can manage FAQ items"
  on public.faq_items for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read published contact items" on public.contact_items;
drop policy if exists admin_select on public.contact_items;
create policy "Anyone can read published contact items"
  on public.contact_items for select
  using ((published = true and deleted_at is null) or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage contact items" on public.contact_items;
drop policy if exists admin_insert on public.contact_items;
drop policy if exists admin_update on public.contact_items;
drop policy if exists admin_delete on public.contact_items;
create policy "Admins can manage contact items"
  on public.contact_items for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can read site media" on storage.objects;
create policy "Anyone can read site media"
  on storage.objects for select
  using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and public.is_admin(auth.uid()));

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
  on storage.objects for update
  using (bucket_id = 'site-media' and public.is_admin(auth.uid()))
  with check (bucket_id = 'site-media' and public.is_admin(auth.uid()));

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
  on storage.objects for delete
  using (bucket_id = 'site-media' and public.is_admin(auth.uid()));

notify pgrst, 'reload schema';
