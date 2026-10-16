# ADJ Admin

The staff workspace for ADJ Educational Consultants. It manages the public site content and consultation requests stored in Supabase.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.local.example` to `.env.local` and set the Supabase URL, anon key, and service-role key for the ADJ project.
3. Set `SITE_REVALIDATE_URL` and `REVALIDATE_SECRET` to connect content saves to the public site's cache-revalidation endpoint.
4. Run `npm run preview` to open the local preview at `http://127.0.0.1:1235`.

Keep the service-role key server-side. Never use a `NEXT_PUBLIC_` prefix for it, and never commit `.env.local`.

## Checks

Run `npm run typecheck` and `npm run lint` before publishing changes.
