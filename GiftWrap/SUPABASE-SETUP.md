# Supabase setup

The sign-in and sign-up page accepts a username and password only. Authentication
runs in the `gift-auth` Supabase Edge Function; it does not use Supabase Auth's
email/phone login or create email-shaped aliases. Passwords are salted
PBKDF2-SHA256 hashes stored server-side in `AppUser`. Opaque session tokens are
stored in the current browser tab's session storage and only their hashes are
stored in `AppSession`.

## 1. Apply the database migration

Install the Supabase CLI, sign in, then run these commands from `GiftWrap`:

```powershell
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

The migration creates `AppUser`, `AppSession`, and `AppLoginAttempt`, plus an
atomic per-username rate-limit function. Row-level security is enabled and access
is revoked from `anon` and `authenticated`; only the Edge Function's service role
can use these objects. It also migrates `Product` into the storefront catalog
schema and inserts or updates the 16 products defined in `src/backend/catalog.js`.
Running `npx supabase db push` applies pending migrations; it is safe to rerun and
does not duplicate seeded products.

The existing `User` table is deliberately left untouched. In particular,
`User.user_password` is never read, written, or used to authenticate. Existing
accounts are not imported because the current password column cannot safely be
assumed to contain password hashes; create accounts through the new sign-up page.

## 2. Deploy the Edge Function

```powershell
npx supabase functions deploy gift-auth
```

The function needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Supabase
provides these to hosted Edge Functions; if the service key is not available in
the function environment, add it as a function secret in the Supabase dashboard.
Never put the service-role key in `GiftWrap/.env`, frontend code, or source
control.

The function's gateway JWT check is disabled in `supabase/config.toml` because
this app authenticates its own opaque session tokens. The function validates the
session on each catalog, session, and logout request. It also limits each
username to ten sign-in attempts per 15 minutes.

## 3. Configure the local app

`GiftWrap/.env` should contain the project URL and publishable key:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These are public project settings, not the service-role key. The project's
`.env` is ignored by Git.

## 4. Product catalog

The migration preserves the existing `Product` table and its `id`, renames the
misspelled `poduct_name` column to `product_name` (and converts it to text), then
adds `product_slug`, `brand`, `price_cents`, `category`, `kind`, `color`, `image`,
and `badge`. The product cards and custom gift-box builder load their product
records from this table after sign-in. The three recipient filters are based on
each product's `category` field; the separate `Categories` table is no longer
queried or displayed.

The migration and Edge Function expect the table to be named exactly `Product`.
PostgreSQL folds unquoted table names to lowercase, so if the existing table is
actually lowercase, adjust the table name references in the migration and
`supabase/functions/gift-auth/index.ts` before pushing/deploying. The Edge Function
uses the service role for catalog reads; do not add public read policies just for
this app.
