create or replace function public.set_portfolio_image_override(
  override_project_key text,
  override_image_slot text,
  override_image_url text,
  override_alt_th text,
  override_media_asset_id uuid default null
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

  insert into public.portfolio_image_overrides (
    project_key,
    image_slot,
    image_url,
    alt_th,
    media_asset_id,
    deleted_at,
    purge_after,
    updated_at
  )
  values (
    override_project_key,
    override_image_slot,
    override_image_url,
    coalesce(nullif(trim(override_alt_th), ''), 'Portfolio image'),
    override_media_asset_id,
    null,
    null,
    now()
  )
  on conflict (project_key, image_slot) do update
  set
    image_url = excluded.image_url,
    alt_th = excluded.alt_th,
    media_asset_id = excluded.media_asset_id,
    deleted_at = null,
    purge_after = null,
    updated_at = now();
end;
$$;

grant execute on function public.set_portfolio_image_override(text, text, text, text, uuid) to authenticated;

notify pgrst, 'reload schema';
