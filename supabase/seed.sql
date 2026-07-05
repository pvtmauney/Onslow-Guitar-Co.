-- Onslow Guitar Co. — seed data from the design prototype
-- Run once, after the migrations. Safe to re-run only on an empty database
-- (it would otherwise create duplicates).

/* ------------------------------- builders ------------------------------ */

insert into public.luthiers (name, town, county, badge, bio, specialties, sort_order)
values (
  'Justin Jenkins',
  'Jacksonville, North Carolina',
  'Onslow County',
  'UP & COMING',
  'Justin is the newest bench on our wall and the builder we''re most excited to watch. Working out of his shop right here in Jacksonville, his early instruments already show the two things we look for before anything else — clean joinery and an honest voice — and each build is coming out better than the last. Come play his current work while it''s still priced like a beginning.',
  array['FIRST BUILDS', 'SMALL BATCH', 'ASK TO SEE HIS LATEST'],
  0
);

/* -------------------------------- gear --------------------------------- */

insert into public.products (name, category, price, status, description, sort_order) values
  ('15W Hand-Wired Tube Combo', 'Amplifiers', '$649', 'In stock',
   'Warm, touch-sensitive, and plenty loud for any stage in the county. Come play through it.', 0),
  ('5W Practice Tube Amp', 'Amplifiers', '$329', 'In stock',
   'Real tube tone at bedroom volume. Our favorite pairing with a handbuilt parlor.', 1),
  ('Instrument Cable — 15''', 'Cables', '$34', 'In stock',
   'Braided jacket, quiet shielding, right-angle option. Lifetime solder-joint repairs at our bench.', 2),
  ('Phosphor Bronze Strings — Light', 'Strings', '$11', 'In stock',
   'Our house pick for the acoustics on the wall. Free install with any setup.', 3),
  ('Leather Guitar Strap', 'Straps', '$58', 'Low stock',
   'Full-grain leather, broken in by playing, not by machines. Ages like a good guitar.', 4),
  ('Clip-On Tuner', 'Accessories', '$19', 'In stock',
   'Small, accurate, and lives in your case pocket.', 5);

/* -------------------------------- merch -------------------------------- */

insert into public.products (name, category, price, status, description, sort_order) values
  ('OGC Logo T-Shirt', 'Merch', '$24', 'In stock',
   'Soft-washed cotton with the shop mark on the chest. S–3XL.', 6),
  ('OGC Coffee Mug', 'Merch', '$14', 'In stock',
   'Holds the coffee we hand you when you walk in.', 7),
  ('OGC Koozie', 'Merch', '$6', 'In stock',
   'Keeps a cold one cold while you argue about tonewoods.', 8),
  ('OGC Trucker Hat', 'Merch', '$22', 'In stock',
   'Structured front, mesh back, shop mark stitched on. One size fits most.', 9),
  ('Shop Work Shirt', 'Merch', '$42', 'Special order',
   'The button-up our bench wears, with the OGC patch over the pocket. Tell us your size and we''ll order it.', 10),
  ('Sticker Pack', 'Merch', '$5', 'In stock',
   'Four weatherproof stickers for the case, the toolbox, or the tailgate.', 11),
  ('Fridge Magnet', 'Merch', '$4', 'In stock',
   'Holds up the setlist. Or the grocery list.', 12),
  ('Car Decal', 'Merch', '$8', 'In stock',
   'Die-cut vinyl shop mark for the back glass. Outdoor-rated.', 13),
  ('Blueprint Tee', 'Merch', '$26', 'In stock',
   'Our luthier''s guitar-plan drawing printed across the chest. Soft-washed cotton, S–3XL.', 14),
  ('Tonewood Tee', 'Merch', '$26', 'In stock',
   '"Ask me about tonewoods" — fair warning to everyone around you. S–3XL.', 15),
  ('Kids'' OGC Tee', 'Merch', '$18', 'In stock',
   'Shop mark in kid sizes, for the youngest players in the house. 2T–youth XL.', 16),
  ('Long-Sleeve Shop Tee', 'Merch', '$32', 'In stock',
   'The logo tee with sleeves for the cooler months. S–3XL.', 17);
