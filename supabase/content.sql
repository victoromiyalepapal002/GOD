-- Run this in Supabase: SQL Editor -> New query -> paste -> Run (after schema.sql).
-- Safe to run again. Adds: daily devotionals, music and sermons, the "Sons of God"
-- membership card, and prayer wall moderation.

-- ---------- Daily devotionals ----------
-- Private: only the server (service role) reads and writes these.
create table if not exists public.devotionals (
  date date primary key,
  title text not null,
  verse_ref text not null,
  verse_text text not null,
  reflection text not null,
  prayer text,
  question text,
  source text not null default 'ai' check (source in ('ai','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.devotionals enable row level security;

-- ---------- Music and sermons ----------
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'music' check (kind in ('music','sermon')),
  title text not null,
  artist text,
  url text not null,
  description text,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.media_items enable row level security;
drop policy if exists "public reads enabled media" on public.media_items;
create policy "public reads enabled media" on public.media_items
  for select using (enabled = true);

-- ---------- Sons of God membership card ----------
create table if not exists public.members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  member_no bigint generated always as identity,
  display_name text not null check (char_length(display_name) between 1 and 30),
  title text not null default 'son' check (title in ('son','daughter','child')),
  motto text check (motto is null or char_length(motto) <= 60),
  created_at timestamptz not null default now()
);
create unique index if not exists members_member_no_key on public.members (member_no);
alter table public.members enable row level security;

drop policy if exists "own card read" on public.members;
drop policy if exists "own card insert" on public.members;
drop policy if exists "own card update" on public.members;
drop policy if exists "own card delete" on public.members;
create policy "own card read" on public.members for select using (auth.uid() = user_id);
create policy "own card insert" on public.members for insert with check (auth.uid() = user_id);
create policy "own card update" on public.members for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own card delete" on public.members for delete using (auth.uid() = user_id);

-- Members can set only their name, title and motto. The number and date are always system-made.
revoke insert, update on public.members from anon, authenticated;
grant insert (user_id, display_name, title, motto) on public.members to authenticated;
grant update (display_name, title, motto) on public.members to authenticated;

create or replace function public.member_count()
returns bigint language sql stable security definer set search_path = public as $$
  select count(*) from public.members
$$;
grant execute on function public.member_count() to anon, authenticated;

-- ---------- Prayer wall moderation ----------
alter table public.prayer_requests add column if not exists hidden boolean not null default false;
drop policy if exists "anyone reads prayers" on public.prayer_requests;
drop policy if exists "anyone reads visible prayers" on public.prayer_requests;
create policy "anyone reads visible prayers" on public.prayer_requests
  for select using (hidden = false);

-- Visitors can post only what they type. The prayer count and hidden flag are system-controlled.
revoke insert on public.prayer_requests from anon, authenticated;
grant insert (user_id, display_name, request) on public.prayer_requests to authenticated;
