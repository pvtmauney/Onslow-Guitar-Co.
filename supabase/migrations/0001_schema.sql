-- Onslow Guitar Co. — schema + row level security
-- Run this first (Supabase SQL editor or `supabase db push`).

create extension if not exists pgcrypto;

/* ------------------------------- tables ------------------------------- */

create table if not exists public.luthiers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  town        text not null default '',
  county      text not null default '',
  badge       text,
  bio         text not null default '',
  specialties text[] not null default '{}',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.luthier_media (
  id           uuid primary key default gen_random_uuid(),
  luthier_id   uuid not null references public.luthiers (id) on delete cascade,
  kind         text not null check (kind in ('photo', 'video_file', 'youtube', 'vimeo')),
  storage_path text,
  external_id  text,
  alt_text     text not null default '',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  -- photos and uploaded videos need a storage path; embeds need an external id
  check (
    (kind in ('photo', 'video_file') and storage_path is not null)
    or
    (kind in ('youtube', 'vimeo') and external_id is not null)
  )
);

create index if not exists luthier_media_luthier_idx
  on public.luthier_media (luthier_id, sort_order);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in
    ('Amplifiers', 'Speaker Cabinets', 'Cables', 'Strings', 'Straps', 'Accessories', 'Merch')),
  price       text not null default '',
  status      text not null default 'In stock' check (status in
    ('In stock', 'Low stock', 'Sold out', 'Special order')),
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.product_photos (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text     text not null default '',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists product_photos_product_idx
  on public.product_photos (product_id, sort_order);

/* -------------------------- row level security ------------------------- */
-- Everyone may read site content; only the authenticated owner may write.

alter table public.luthiers enable row level security;
alter table public.luthier_media enable row level security;
alter table public.products enable row level security;
alter table public.product_photos enable row level security;

-- luthiers
create policy "Public read luthiers"
  on public.luthiers for select
  to anon, authenticated
  using (true);

create policy "Owner insert luthiers"
  on public.luthiers for insert
  to authenticated
  with check (true);

create policy "Owner update luthiers"
  on public.luthiers for update
  to authenticated
  using (true)
  with check (true);

create policy "Owner delete luthiers"
  on public.luthiers for delete
  to authenticated
  using (true);

-- luthier_media
create policy "Public read luthier_media"
  on public.luthier_media for select
  to anon, authenticated
  using (true);

create policy "Owner insert luthier_media"
  on public.luthier_media for insert
  to authenticated
  with check (true);

create policy "Owner update luthier_media"
  on public.luthier_media for update
  to authenticated
  using (true)
  with check (true);

create policy "Owner delete luthier_media"
  on public.luthier_media for delete
  to authenticated
  using (true);

-- products
create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Owner insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Owner update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "Owner delete products"
  on public.products for delete
  to authenticated
  using (true);

-- product_photos
create policy "Public read product_photos"
  on public.product_photos for select
  to anon, authenticated
  using (true);

create policy "Owner insert product_photos"
  on public.product_photos for insert
  to authenticated
  with check (true);

create policy "Owner update product_photos"
  on public.product_photos for update
  to authenticated
  using (true)
  with check (true);

create policy "Owner delete product_photos"
  on public.product_photos for delete
  to authenticated
  using (true);
