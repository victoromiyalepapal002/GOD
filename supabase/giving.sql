-- Run this in Supabase: SQL Editor -> New query -> paste -> Run
-- Giving methods (bank details, payment links) shown on the public /give page.
-- Anyone can READ enabled methods (they are meant to be public). Only the server
-- (service role key, from the Admin page) can add, edit or delete them.

create table if not exists public.giving_methods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  category text not null default 'both' check (category in ('both','tithe','donation')),
  url text,
  details text,
  enabled boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.giving_settings (
  id int primary key default 1 check (id = 1),
  intro text not null default 'Give cheerfully, as you have decided in your heart.',
  updated_at timestamptz default now()
);

alter table public.giving_methods enable row level security;
alter table public.giving_settings enable row level security;

drop policy if exists "public reads enabled giving methods" on public.giving_methods;
create policy "public reads enabled giving methods" on public.giving_methods
  for select using (enabled = true);

drop policy if exists "public reads giving settings" on public.giving_settings;
create policy "public reads giving settings" on public.giving_settings
  for select using (true);

insert into public.giving_settings (id) values (1) on conflict (id) do nothing;
