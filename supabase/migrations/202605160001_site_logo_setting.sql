alter table public.site_settings
  add column if not exists logo_url text not null default '/images/LogoTRP.webp';

update public.site_settings
set logo_url = coalesce(nullif(logo_url, ''), '/images/LogoTRP.webp')
where id = true;

notify pgrst, 'reload schema';
