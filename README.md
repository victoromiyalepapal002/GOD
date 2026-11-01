# GOD

A faith website: personal visions and horoscope-style words, an AI "Man of God" pastor chat, an AI "Jesus" chat (inspired by the Gospels), live services, and a prayer wall.

**Stack:** Next.js 14 (App Router) · Tailwind · Supabase (auth + database) · free AI API (Gemini or Groq) · Vercel

## 1. Get a free AI key
- **Gemini (default):** create a key at https://aistudio.google.com/apikey
- **Groq (alternative):** create a key at https://console.groq.com and set `LLM_BASE_URL` and `LLM_MODEL` as shown in `.env.example`

Free tiers have rate limits and model names change over time. If the AI says the limit was reached, wait a minute. If a model name stops working, change `LLM_MODEL`; no code changes are needed.

## 2. Supabase
1. Create a project at https://supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. Project Settings → API → copy the **Project URL** and **anon key**.
4. Authentication → URL Configuration → set Site URL to your Vercel URL once deployed.

## 3. Run locally
```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

## 4. Deploy on Vercel
1. https://vercel.com/new → import this repo.
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `LLM_API_KEY` (and optionally `LLM_BASE_URL`, `LLM_MODEL`).
3. Deploy. Every push to `main` redeploys.

## Managing content
- **Services:** Supabase → Table Editor → `services` (add title, time, and a YouTube Live / Zoom / Meet link in `stream_url`).
- **AI personalities and safety rules:** `lib/personas.ts`.
- **AI provider:** `lib/llm.ts`.

## Design
Glass surfaces, a CSS-only 3D hero and tilt cards. No heavy 3D libraries, so pages stay fast. Motion switches off for visitors who prefer reduced motion.

## Notes
- The AI personas always identify as AI and are not real clergy or Jesus. Keep the footer disclaimers.
- Keep `LLM_API_KEY` server-side only (never prefix it with `NEXT_PUBLIC_`).
