-- 003: public consultation submissions.
-- Anyone may INSERT an inquiry; nobody may read via the anonymous key.
-- ADJ-ADMIN reads/deletes via service_role (bypasses RLS).
create table if not exists consultation_submissions (
  id bigserial primary key,
  name text not null,
  phone text not null,
  exam text not null default '',
  level text not null default '',
  mode text not null default '',
  notes text not null default '',
  source text not null default '',
  created_at timestamptz not null default now()
);

alter table consultation_submissions enable row level security;
create policy "anon can insert submissions" on consultation_submissions
  for insert to anon, authenticated with check (true);
-- deliberately no SELECT policy for anon/authenticated.
