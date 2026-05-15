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

  delete from public.media_assets
  where id = asset_id;
end;
$$;

grant execute on function public.hard_delete_media_asset(uuid) to authenticated;
notify pgrst, 'reload schema';
