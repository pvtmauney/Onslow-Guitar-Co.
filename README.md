# Onslow Guitar Co. — website

Production website for Onslow Guitar Co., a boutique guitar store in
Jacksonville, North Carolina that sells instruments handbuilt by local
luthiers in Onslow County and surrounding counties.

- **Framework:** Next.js (App Router, TypeScript), deployed on Vercel
- **Backend:** Supabase (Postgres, auth, file storage)
- **Styling:** Tailwind CSS v4 + the design system from the original prototype
  (`onslow-guitar-co.html`, kept in this repo for reference)

> ⚠️ **Placeholder business info.** All prices, the street address
> (212 Court Street), the phone number ((910) 555-0164), and the email
> (hello@onslowguitar.co) are placeholders. Replace them with the real
> business info before launch:
> - Address / phone / email / hours: edit the `SITE` constant in
>   [`lib/types.ts`](lib/types.ts)
> - Prices and product copy: edit items in the admin panel (or
>   `supabase/seed.sql` before seeding)

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com), create a (free) account and a
   new project. Pick a strong database password and a region near the US East
   coast (e.g. `us-east-1`).
2. Wait for the project to finish provisioning.

## 2. Run the migrations and seed

In the Supabase dashboard, open **SQL Editor** and run these files in order
(paste the contents of each and click *Run*):

1. `supabase/migrations/0001_schema.sql` — tables + row-level security
2. `supabase/migrations/0002_storage.sql` — the public `media` storage bucket
   and its policies
3. `supabase/seed.sql` — seeds Justin Jenkins and all gear/merch items from
   the prototype (run this **once**)

(If you prefer the Supabase CLI: `supabase link`, then `supabase db push`,
then run the seed with `supabase db execute --file supabase/seed.sql`.)

## 3. Create the single owner account

Public sign-ups must stay disabled — there is exactly one owner login.

1. Dashboard → **Authentication → Sign In / Up → Auth Providers → Email**:
   leave Email enabled, and **turn off "Allow new users to sign up"**.
2. Dashboard → **Authentication → Users → Add user → Create new user**:
   enter the owner's email and a strong password, and check
   **Auto Confirm User**.

That email + password is what the owner uses at `/admin/login`.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in the values from
**Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Optionally set `NEXT_PUBLIC_SITE_URL` to the production domain
(e.g. `https://onslowguitar.co`) so Open Graph tags, the sitemap, and
JSON-LD point at the right host.

No service-role key is needed anywhere — all writes go through the owner's
authenticated session and are enforced by row-level security.

## 5. Run locally

```
npm install
npm run dev
```

Open http://localhost:3000 (public site) and http://localhost:3000/admin
(owner panel).

## 6. Deploy to Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In [vercel.com](https://vercel.com) → **Add New Project**, import the repo.
   Vercel auto-detects Next.js; no build settings needed.
3. Under **Environment Variables**, add the same three variables from step 4
   (set `NEXT_PUBLIC_SITE_URL` to the production URL).
4. Deploy. The free Hobby tier is fine to start.

After deploying, verify `/admin/login` works and that saving an item in the
admin updates the home page.

## Notes & limits

- **Images** are resized/compressed in the browser (max 1600 px, WebP) before
  upload, stored in the public `media` bucket; the database stores only the
  storage path.
- **Videos**: YouTube/Vimeo links are recommended (the admin UI says so).
  Direct uploads are accepted up to 200 MB, **but** Supabase's free tier caps
  individual file uploads at 50 MB. Raising the cap (Project Settings →
  Storage) beyond 50 MB requires the Pro plan (~$25/mo) — a paid decision
  left to you.
- The home page is statically generated and revalidates every 5 minutes;
  admin saves also refresh it immediately.
- `/admin` and all mutating server actions verify the session server-side;
  row-level security and storage policies enforce owner-only writes even if
  the app code were bypassed.

## Project layout

```
app/                 Pages (public home, /admin panel)
components/          Public UI + admin form components
lib/                 Supabase clients, server actions, types, media helpers
supabase/migrations  Schema, RLS, storage policies
supabase/seed.sql    Prototype content (Justin Jenkins + gear/merch)
OWNER-GUIDE.md       Plain-English guide for the shop owner
```
