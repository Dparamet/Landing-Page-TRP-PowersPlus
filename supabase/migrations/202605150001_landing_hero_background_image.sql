alter table public.portfolio_image_overrides
  drop constraint if exists portfolio_image_overrides_image_slot_check;

alter table public.portfolio_image_overrides
  add constraint portfolio_image_overrides_image_slot_check
  check (image_slot in ('cover', 'before', 'during', 'after', 'hero_background'));
