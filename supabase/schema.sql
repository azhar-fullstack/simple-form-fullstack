-- Run in Supabase: SQL Editor → New query → paste → Run

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

comment on table public.contacts is 'Demo contact submissions from the Next.js form.';
