alter table public.standard_items
  add column if not exists hover_image_url text,
  add column if not exists hover_media_asset_id uuid references public.media_assets(id) on delete set null;
