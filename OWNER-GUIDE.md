# Onslow Guitar Co. — Owner's Guide

This is your guide to updating the website yourself. No technical knowledge
needed. Anything you save appears on the public site within moments.

## Signing in

1. Scroll to the bottom of the website and click **Owner sign-in**
   (or go straight to `yoursite.com/admin`).
2. Enter your email and password. (There's only one account — yours. If you
   forget the password, your web person can reset it in Supabase.)
3. You'll land on the **Owner panel**, with two sections: **Builders** and
   **Gear & Merch**.

## Adding a luthier

1. In the Owner panel, click **+ Add a luthier**.
2. Fill in their **name**, **town**, and **bio** (required). County, badge
   (like "UP & COMING"), and specialties are optional but make the profile
   look great. Specialties are comma-separated, e.g. `OM, DREADNOUGHT, 12-FRET`.
3. Click **Add to website**. Done — they're live.

Use the **↑ / ↓ arrows** on the dashboard to change the order builders
appear on the site.

## Adding photos

1. Open the builder (or shop item) and click the dashed **photo box**.
2. Pick one or more photos from your computer or phone. They're
   automatically shrunk to web size — you can upload straight from a camera.
3. **The first photo is the main one** (the portrait for a builder, the card
   photo for a product). Use the ← → arrows on a photo to reorder.
4. Type a short description under each photo (e.g. "Justin sanding a guitar
   top in his workshop"). This is required — it's what blind visitors'
   screen readers say, and it helps Google too.
5. Click **Save changes**.

## Adding videos

On a builder's page, under **Videos**:

- **Best way:** upload the video to YouTube (a free account is fine), copy
  the link, paste it in the box, and click **Add video link**. Vimeo links
  work too.
- You can also upload a video file directly, but links play better and
  don't use up the website's storage.

## Adding gear or merch

1. Click **+ Add a shop item**.
2. Give it a **name**, pick a **category** (Amplifiers, Cables, Strings,
   Straps, Accessories — or **Merch** for shirts, hats, mugs, koozies,
   stickers, magnets, and decals).
3. **Price** is free-form: `$24`, `From $58`, whatever reads right.
4. Pick **availability**: In stock, Low stock, Sold out, or Special order.
   (When something sells, just change this — no need to delete the item.)
5. Add a photo and a one-or-two-sentence description, then **Add to shop**.

## Changing hours, address, phone, or email

These live in the website's code (so they can't be broken by accident).
Ask your web person to update the `SITE` info in `lib/types.ts` — it takes
them about a minute, and the site updates on the next deploy.

## Good to know

- **Deleting** a builder or item can't be undone — the site will ask you to
  confirm first.
- Changes show up on the live site right away (give it a few seconds and
  refresh).
- Sign out with the **Sign out** button when you're on a shared computer.
