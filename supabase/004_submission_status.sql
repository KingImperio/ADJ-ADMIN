-- 004: booking request status pipeline
alter table consultation_submissions
  add column if not exists status text not null default 'new'
  check (status in ('new','called','scheduled','declined'));
