-- Adds the 'Speaker Cabinets' product category.
-- Only needed if you ran 0001_schema.sql before this category existed;
-- safe to run either way.

alter table public.products
  drop constraint if exists products_category_check;

alter table public.products
  add constraint products_category_check check (category in
    ('Amplifiers', 'Speaker Cabinets', 'Cables', 'Strings', 'Straps', 'Accessories', 'Merch'));
