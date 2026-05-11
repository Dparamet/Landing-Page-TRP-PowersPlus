create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question jsonb not null,
  answer jsonb not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.faq_items enable row level security;

drop policy if exists "Anyone can read published FAQ items" on public.faq_items;
drop policy if exists "Admins can manage FAQ items" on public.faq_items;

create policy "Anyone can read published FAQ items"
  on public.faq_items for select
  using (published = true or public.is_admin());

create policy "Admins can manage FAQ items"
  on public.faq_items for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.faq_items to anon, authenticated;
grant insert, update, delete on public.faq_items to authenticated;

insert into public.faq_items (id, question, answer, sort_order, published)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '{"th":"ต้องใช้เวลานานแค่ไหนสำหรับการติดตั้งโซลาร์เซลล์?","en":"How long does a solar installation take?"}',
    '{"th":"ระยะเวลาการติดตั้งขึ้นอยู่กับขนาดของระบบ โดยทั่วไปการติดตั้งใช้เวลา 3-7 วัน สำหรับระบบขนาดกลาง นอกจากนี้เรายังมีขั้นตอนตรวจสอบและทดสอบอย่างละเอียด","en":"Installation time depends on system size. A typical mid-size project takes 3-7 days, followed by detailed inspection and testing."}',
    10,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '{"th":"ประกันสินค้าและการติดตั้งนานเท่าไหร่?","en":"How long are product and installation warranties?"}',
    '{"th":"เรามีการรับประกัน 5 ปีสำหรับการติดตั้งและงานวิศวกรรม และสินค้าโซลาร์เซลล์มีการรับประกัน 25-30 ปี นอกจากนี้เรายังให้บริการซ่อมบำรุงตลอดชีวิตของระบบ","en":"Installation and engineering work are covered for 5 years. Solar products usually carry 25-30 year warranties, and maintenance support is available through the system lifetime."}',
    20,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '{"th":"ราคาการติดตั้งเท่าไหร่ และมีเงื่อนไขอะไรบ้าง?","en":"How much does installation cost and what affects pricing?"}',
    '{"th":"ราคาขึ้นอยู่กับขนาดของระบบ และจำนวนแผงโซลาร์เซลล์ที่ต้องการ เราให้บริการประเมินหน้างานฟรี โดยสามารถให้ใบเสนอราคาที่แน่นอนหลังจากตรวจสอบสภาพอาคารเรียบร้อยแล้ว","en":"Pricing depends on system size, equipment, and site conditions. We provide a free site assessment and can quote accurately after inspecting the building."}',
    30,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '{"th":"ระบบโซลาร์เซลล์ต้องการการบำรุงรักษาหรือไม่?","en":"Does a solar system need maintenance?"}',
    '{"th":"ระบบโซลาร์เซลล์ต้องการการดูแลเพียงเล็กน้อย เช่น การทำความสะอาดแผงเป็นครั้งคราว เรามีบริการดูแลรักษาประจำปีที่ราคาไม่แพง","en":"Solar systems need light maintenance such as occasional panel cleaning and system checks. We offer practical annual maintenance options."}',
    40,
    true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '{"th":"สามารถลดค่าไฟของบ้านได้มากแค่ไหน?","en":"How much can solar reduce a home electricity bill?"}',
    '{"th":"การลดค่าไฟขึ้นอยู่กับการใช้พลังงาน ขนาดระบบ และสภาพอากาศในพื้นที่ โดยทั่วไปลูกค้าของเรามีค่าไฟลดลง 50-80% ตามการออกแบบระบบ","en":"Savings depend on usage, system size, and site conditions. Many customers reduce bills by around 50-80% when the system is sized well."}',
    50,
    true
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '{"th":"ทำไมต้องเลือก TRP Powers Plus?","en":"Why choose TRP Powers Plus?"}',
    '{"th":"เรามีประสบการณ์กว่า 10 ปี ในการติดตั้งระบบไฟฟ้าและโซลาร์เซลล์ ทีมของเราประกอบด้วยวิศวกรและช่างผู้ชำนาญการที่ได้รับการรับรองสากล ให้บริการฉันทนะสูง และดูแลรักษาหลังการติดตั้งอย่างยาวนาน","en":"Our team brings more than 10 years of electrical and solar experience, with skilled engineers and technicians who plan, install, test, and support each project carefully."}',
    60,
    true
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '{"th":"มีตัวอย่างผลงานของเราไหม?","en":"Can I see examples of past projects?"}',
    '{"th":"ใช่แน่นอน! เรามีผลงานมากกว่า 500 โครงการที่สมบูรณ์แล้ว จากบ้านเดี่ยว ท่าเรือ ไปจนถึงอาคารสูง คุณสามารถดูผลงานของเราในหน้า \"ผลงาน\" ของเว็บไซต์นี้","en":"Yes. You can review representative projects in the portfolio section, including residential, commercial, factory, inspection, and control panel work."}',
    70,
    true
  )
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
