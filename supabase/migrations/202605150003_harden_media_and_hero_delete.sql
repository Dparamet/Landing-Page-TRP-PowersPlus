create or replace function public.hard_delete_portfolio_image_override(
  override_project_key text,
  override_image_slot text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'admin permission required';
  end if;

  delete from public.portfolio_image_overrides
  where project_key = override_project_key
    and image_slot = override_image_slot;
end;
$$;

create or replace function public.hard_delete_media_asset(asset_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_asset public.media_assets%rowtype;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'admin permission required';
  end if;

  select *
  into target_asset
  from public.media_assets
  where id = asset_id;

  if not found then
    return;
  end if;

  delete from public.portfolio_image_overrides
  where media_asset_id = asset_id;

  update public.portfolio_projects
  set
    cover_image_id = null,
    updated_at = now()
  where cover_image_id = asset_id;

  delete from storage.objects
  where bucket_id = target_asset.bucket
    and name = target_asset.path;

  delete from public.media_assets
  where id = asset_id;
end;
$$;

grant execute on function public.hard_delete_portfolio_image_override(text, text) to authenticated;
grant execute on function public.hard_delete_media_asset(uuid) to authenticated;

notify pgrst, 'reload schema';
