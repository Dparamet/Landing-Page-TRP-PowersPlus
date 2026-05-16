alter table public.standard_items
  add column if not exists image_alt text not null default '';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'standard_items'
      and column_name = 'alt_text'
  ) then
    update public.standard_items
    set image_alt = coalesce(nullif(image_alt, ''), alt_text)
    where image_alt = '';
  end if;
end $$;

notify pgrst, 'reload schema';
