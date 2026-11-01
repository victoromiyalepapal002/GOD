-- Run this in Supabase: SQL Editor -> New query -> paste -> Run
-- Stores the AI providers, their models, keys and priority.
-- Row Level Security is ON with NO policies, so the browser can never read the keys.
-- Only the server (using SUPABASE_SERVICE_ROLE_KEY) can read or change this table.

create table if not exists public.ai_providers (
  id text primary key check (id in ('openrouter','gemini','groq')),
  name text not null,
  base_url text not null,
  model text not null,
  api_key text,
  enabled boolean not null default true,
  priority int not null default 1,
  updated_at timestamptz default now()
);

alter table public.ai_providers enable row level security;

insert into public.ai_providers (id, name, base_url, model, priority) values
  ('gemini',     'Google Gemini', 'https://generativelanguage.googleapis.com/v1beta/openai', 'gemini-2.5-flash-lite',              1),
  ('groq',       'Groq',          'https://api.groq.com/openai/v1',                           'llama-3.3-70b-versatile',             2),
  ('openrouter', 'OpenRouter',    'https://openrouter.ai/api/v1',                             'meta-llama/llama-3.3-70b-instruct:free', 3)
on conflict (id) do nothing;
