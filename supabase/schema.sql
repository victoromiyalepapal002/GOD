-- Run this in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  birth_date date,
  created_at timestamptz default now()
);

create table if not exists public.visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('vision','horoscope')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  persona text not null check (persona in ('manofgod','jesus')),
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  stream_url text,
  created_at timestamptz default now()
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text default 'Anonymous',
  request text not null,
  prayer_count int default 0,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.visions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.services enable row level security;
alter table public.prayer_requests enable row level security;

create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "own visions" on public.visions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own chats" on public.chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "anyone reads services" on public.services for select using (true);

create policy "anyone reads prayers" on public.prayer_requests for select using (true);
create policy "signed in posts prayers" on public.prayer_requests for insert
  with check (auth.uid() = user_id);

create or replace function public.pray_for(request_id uuid)
returns void language sql security definer as $$
  update public.prayer_requests set prayer_count = prayer_count + 1 where id = request_id;
$$;

-- Sample service so the page isn't empty
insert into public.services (title, description, starts_at, stream_url)
values ('Sunday Worship Service', 'Join us for worship, the Word and prayer.',
        date_trunc('week', now()) + interval '6 days 9 hours', null);
