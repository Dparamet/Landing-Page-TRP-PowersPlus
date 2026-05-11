create table if not exists public.site_texts (
  key text primary key,
  value jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_texts enable row level security;
alter table public.process_steps enable row level security;

drop policy if exists "Anyone can read site texts" on public.site_texts;
drop policy if exists "Admins can manage site texts" on public.site_texts;
drop policy if exists "Anyone can read published process steps" on public.process_steps;
drop policy if exists "Admins can manage process steps" on public.process_steps;

create policy "Anyone can read site texts"
  on public.site_texts for select
  using (true);

create policy "Admins can manage site texts"
  on public.site_texts for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read published process steps"
  on public.process_steps for select
  using (published = true or public.is_admin());

create policy "Admins can manage process steps"
  on public.process_steps for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.site_texts to anon, authenticated;
grant insert, update, delete on public.site_texts to authenticated;

grant select on public.process_steps to anon, authenticated;
grant insert, update, delete on public.process_steps to authenticated;

drop trigger if exists set_site_texts_updated_at on public.site_texts;
create trigger set_site_texts_updated_at
  before update on public.site_texts
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_process_steps_updated_at on public.process_steps;
create trigger set_process_steps_updated_at
  before update on public.process_steps
  for each row
  execute function public.set_updated_at();

insert into public.site_texts (key, value)
values
  ('hero.eyebrow', '{"th":"โซลูชันพลังงานและระบบไฟฟ้าครบวงจร","en":"Complete electrical and energy solutions"}'),
  ('hero.title', '{"th":"TRP Powers Plus","en":"TRP Powers Plus"}'),
  ('hero.subtitle', '{"th":"ออกแบบ ติดตั้ง และดูแลระบบไฟฟ้าและโซลาร์เซลล์สำหรับบ้าน อาคาร และธุรกิจ","en":"Design, installation, and care for electrical and solar systems for homes, buildings, and businesses"}'),
  ('hero.description', '{"th":"วางแผนระบบจากพฤติกรรมการใช้ไฟจริง ตรวจหน้างานก่อนเสนอราคา และอธิบายทางเลือกให้เข้าใจง่าย ตั้งแต่งานไฟฟ้าแรงต่ำไปจนถึงระบบโซลาร์ออนกริดและไฮบริด","en":"We size systems from real electricity usage, inspect the site before quoting, and explain practical options clearly, from low-voltage electrical work to on-grid and hybrid solar systems."}'),
  ('hero.cta', '{"th":"ขอคำปรึกษา","en":"Request Consultation"}'),
  ('hero.trust.engineers', '{"th":"ประเมินโดยทีมช่างและวิศวกร","en":"Assessed by technicians and engineers"}'),
  ('hero.trust.warranty', '{"th":"มีเอกสารส่งมอบและแนวทางดูแลระบบ","en":"Handover documents and care guidance included"}'),
  ('hero.trust.survey', '{"th":"สำรวจหน้างานก่อนสรุปราคา","en":"Site survey before final quotation"}'),
  ('services.eyebrow', '{"th":"บริการรับเหมาระบบไฟฟ้า","en":"Electrical Contractor Services"}'),
  ('services.title', '{"th":"บริการของเรา","en":"Our Services"}'),
  ('services.description', '{"th":"ครอบคลุมงานไฟฟ้าบ้าน อาคาร โรงงาน ตู้ควบคุม โซลาร์เซลล์ และการตรวจสอบระบบเดิม โดยเริ่มจากข้อมูลหน้างานจริงก่อนเสนอราคา","en":"Electrical work for homes, buildings, factories, control panels, solar systems, and existing-system inspections, starting from real site information before quotation."}'),
  ('serviceSelector.eyebrow', '{"th":"เลือกประเภทงาน","en":"Choose Work Type"}'),
  ('serviceSelector.title', '{"th":"บอกงานที่ต้องการ แล้วเตรียมข้อมูลให้ตรงจุด","en":"Pick the job type and prepare the right details"}'),
  ('serviceSelector.description', '{"th":"เลือกประเภทงานเพื่อดูว่าเหมาะกับใคร รับงานอะไรบ้าง และควรเตรียมข้อมูลใดก่อนทัก LINE ให้ทีมประเมินได้เร็วขึ้น","en":"Select a work type to see who it fits, what we handle, and what information to prepare before messaging LINE for a faster assessment."}'),
  ('portfolio.eyebrow', '{"th":"ผลงานของเรา","en":"Our Work"}'),
  ('portfolio.title', '{"th":"ผลงานติดตั้งที่ช่วยให้ตัดสินใจง่ายขึ้น","en":"Installation work that makes decisions easier"}'),
  ('portfolio.description', '{"th":"เลือกดูตามประเภทงาน พร้อมข้อมูลตัดสินใจที่เหมาะกับงานนั้น เช่น ขอบเขตงาน โหลดไฟ ระบบควบคุม ผลประหยัด หรือรายงานตรวจสอบ","en":"Filter by work type and scan decision details that fit the job, such as scope, loads, controls, savings, or inspection reports."}'),
  ('process.eyebrow', '{"th":"ขั้นตอนทำงาน","en":"Work Process"}'),
  ('process.title', '{"th":"ทำงานเป็นระบบตั้งแต่สำรวจจนส่งมอบ","en":"A clear path from survey to handover"}'),
  ('process.description', '{"th":"ลดความเสี่ยงจากการคาดเดา ด้วยขั้นตอนสั้น ชัดเจน และตรวจสอบได้ก่อนตัดสินใจติดตั้งจริง","en":"Reduce guesswork with a short, verifiable process before making a real installation decision."}'),
  ('process.note', '{"th":"ทุกงานควรเริ่มจากข้อมูลค่าไฟ พื้นที่ติดตั้ง และพฤติกรรมการใช้ไฟจริง เพื่อให้ขนาดระบบและงบประมาณใกล้เคียงหน้างานมากที่สุด","en":"Every project should start from electricity bills, installation area, and real usage behavior so the system size and budget stay close to the actual site."}'),
  ('faq.title', '{"th":"คำถามที่ถามบ่อย","en":"Frequently Asked Questions"}'),
  ('faq.subtitle', '{"th":"คิดอยากเรียนรู้เพิ่มเติมเกี่ยวกับการประเมินราคาฟรี และบริการของเรา? ตรวจสอบคำถามที่บ่อยสุดได้ที่นี่","en":"Want to learn more about our free consultation and services? Check out our most frequently asked questions below"}'),
  ('faq.cta', '{"th":"ยังมีคำถามอื่นๆ หรือต้องการประเมินราคา?","en":"Have other questions or need a price estimate?"}'),
  ('contact.title', '{"th":"ติดต่อเรา","en":"Contact Us"}'),
  ('contact.description', '{"th":"ติดต่อเราเพื่อรับการปรึกษาฟรี","en":"Contact us for free consultation"}'),
  ('footer.companySummary', '{"th":"บริษัทรับเหมาไฟฟ้า ติดตั้งโซลาร์เซลล์ และให้บริการด้านพลังงานทดแทนอย่างมืออาชีพ","en":"A professional electrical contractor, solar installer, and renewable energy service provider."}'),
  ('footer.brandStory', '{"th":"TRP Powers Plus คือทีมผู้เชี่ยวชาญด้านระบบไฟฟ้าและพลังงานแสงอาทิตย์ ให้บริการตั้งแต่ให้คำปรึกษา สำรวจหน้างาน ออกแบบ ติดตั้ง ตรวจสอบความปลอดภัย และดูแลหลังส่งมอบ เพื่อให้บ้าน อาคาร และธุรกิจได้ระบบที่เหมาะกับการใช้งานจริง พร้อมเอกสารและมาตรฐานงานที่ตรวจสอบได้","en":"TRP Powers Plus is an electrical and solar energy specialist providing consultation, site surveys, system design, installation, safety inspection, and after-handover care so homes, buildings, and businesses receive systems matched to real usage with clear documentation and accountable work standards."}')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into public.process_steps (id, title, description, sort_order, published)
values
  ('81111111-1111-4111-8111-111111111111', '{"th":"สำรวจข้อมูล","en":"Collect data"}', '{"th":"ดูหน่วยไฟ ค่าไฟ รูปแบบการใช้ไฟ และเป้าหมายของลูกค้า","en":"Review units, electricity cost, usage pattern, and the customer''s goal."}', 10, true),
  ('82222222-2222-4222-8222-222222222222', '{"th":"ตรวจหน้างาน","en":"Survey site"}', '{"th":"ประเมินพื้นที่ติดตั้ง ทิศทางหลังคา โหลดไฟ และข้อจำกัดหน้างาน","en":"Check installation area, roof direction, electrical load, and site constraints."}', 20, true),
  ('83333333-3333-4333-8333-333333333333', '{"th":"ออกแบบระบบ","en":"Design system"}', '{"th":"เลือกขนาดระบบ อุปกรณ์ และแนวทางติดตั้งให้เหมาะกับงบประมาณ","en":"Match system size, equipment, and installation approach to the budget."}', 30, true),
  ('84444444-4444-4444-8444-444444444444', '{"th":"เสนอราคา","en":"Quote clearly"}', '{"th":"สรุปขอบเขตงาน ระยะเวลา ค่าใช้จ่าย และผลประหยัดที่คาดหวัง","en":"Summarize scope, timeline, cost, and expected savings."}', 40, true),
  ('85555555-5555-4555-8555-555555555555', '{"th":"ติดตั้งและส่งมอบ","en":"Install and hand over"}', '{"th":"ติดตั้ง ทดสอบระบบ อธิบายการใช้งาน และส่งมอบเอกสารที่จำเป็น","en":"Install, test, explain operation, and provide required documents."}', 50, true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
