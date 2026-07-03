-- site_texts uses fixed keys edited in place via .upsert(); it has no delete UI
-- and never had one. The soft/hard delete + restore RPCs were never called from
-- the frontend, so drop them as dead database objects.

drop function if exists public.soft_delete_site_text(text, integer);
drop function if exists public.hard_delete_site_text(text);
drop function if exists public.restore_site_text(text);
