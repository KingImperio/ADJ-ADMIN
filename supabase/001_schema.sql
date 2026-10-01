-- ADJ-WEB content backend — schema (migration 001)
-- Every editable string on the marketing site lives here. The site reads
-- these tables at render time and falls back to its bundled JSON if the
-- database is unreachable, so the site never breaks when the DB is down.
-- Writes happen only from the ADJ-ADMIN dashboard via the service_role key.

-- Key-value site settings (phone, email, hours, address, tagline).
create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Homepage programme track cards (6).
create table if not exists tracks (
  slug text primary key,
  badge text not null,
  tone text not null default 'navy'
    check (tone in ('emerald','navy','indigo','amber','neutral')),
  side text not null default '',
  title text not null,
  description text not null default '',
  bullets text[] not null default '{}',
  foot_label text not null default '',
  cta_label text not null default 'Enroll',
  sort int not null default 0
);

-- Homepage "Why ADJ" pillars (4).
create table if not exists pillars (
  id bigserial primary key,
  icon text not null default 'school',
  title text not null,
  copy text not null default '',
  tag text not null default '',
  tag_icon text not null default 'check',
  tone text not null default 'primary' check (tone in ('primary','secondary')),
  sort int not null default 0
);

-- Results Wall of Fame (7 candidates).
create table if not exists wall_entries (
  id bigserial primary key,
  name text not null,
  badge text not null default '',
  tone text not null default 'emerald'
    check (tone in ('emerald','navy','indigo','amber','neutral')),
  area text not null default '',
  perf text not null default '',
  place text not null default '',
  reg text not null default '',
  photo_url text not null default '',
  sort int not null default 0
);

-- Testimonials. scope = 'home' (homepage results trio) | 'parents' (results page).
create table if not exists testimonials (
  id bigserial primary key,
  scope text not null default 'home' check (scope in ('home','parents')),
  quote text not null,
  initials text not null default '',
  name text not null default '',
  detail text not null default '',
  area text not null default '',
  sort int not null default 0
);

-- Programme detail pages (jamb, waec, jupeb, international, admissions, cbt;
-- neco reuses waec). stats = {numbers: string[3], labels: string[3]}.
-- sections = [{title, blocks: [{t: p|h3|h4|list, v: string|string[]}]}].
create table if not exists program_pages (
  slug text primary key,
  h1 text not null,
  lead text not null default '',
  stats jsonb not null default '{"numbers":[],"labels":[]}',
  sections jsonb not null default '[]'
);

-- Index/utility pages (programmes, about, contact). sections shape mirrors
-- program_pages; wall/testis live in their own tables, not here.
create table if not exists page_sections (
  page text primary key,
  h1 text not null,
  lead text not null default '',
  sections jsonb not null default '[]'
);

-- Homepage metric strip, catchment chips, direction steps.
create table if not exists metrics (
  id bigserial primary key,
  value text not null,
  label text not null,
  accent text not null default 'secondary'
    check (accent in ('primary','secondary','tertiary')),
  sort int not null default 0
);
create table if not exists catchments (
  id bigserial primary key,
  name text not null,
  sort int not null default 0
);
create table if not exists directions (
  id bigserial primary key,
  heading text not null,
  copy text not null default '',
  sort int not null default 0
);

-- FAQ groups (group = home | programmes | results | contact). Not all groups
-- are rendered yet; the table reserves them for the admin without code edits.
create table if not exists faqs (
  id bigserial primary key,
  grp text not null default 'home'
    check (grp in ('home','programmes','results','contact')),
  q text not null,
  a text not null default '',
  sort int not null default 0
);

-- Public read for everything; no anon writes. The admin dashboard uses the
-- service_role key server-side, which bypasses RLS.
alter table site_settings enable row level security;
alter table tracks enable row level security;
alter table pillars enable row level security;
alter table wall_entries enable row level security;
alter table testimonials enable row level security;
alter table program_pages enable row level security;
alter table page_sections enable row level security;
alter table metrics enable row level security;
alter table catchments enable row level security;
alter table directions enable row level security;
alter table faqs enable row level security;

create policy "public read settings" on site_settings for select using (true);
create policy "public read tracks" on tracks for select using (true);
create policy "public read pillars" on pillars for select using (true);
create policy "public read wall" on wall_entries for select using (true);
create policy "public read testimonials" on testimonials for select using (true);
create policy "public read program_pages" on program_pages for select using (true);
create policy "public read page_sections" on page_sections for select using (true);
create policy "public read metrics" on metrics for select using (true);
create policy "public read catchments" on catchments for select using (true);
create policy "public read directions" on directions for select using (true);
create policy "public read faqs" on faqs for select using (true);
