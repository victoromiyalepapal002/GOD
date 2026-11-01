# GOD

A faith website: personal visions and horoscope-style words, an AI "Man of God" pastor chat, an AI "Jesus" chat (inspired by the Gospels), live services, and a prayer wall.

**Stack:** Next.js 14 (App Router) · Tailwind · Supabase (auth + database) · Claude API · Vercel

## 1. Supabase
1. Create a project at https://supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. Project Settings → API → copy the **Project URL** and **anon key**.
4. Authentication → URL Configuration → set Site URL to your Vercel URL once deployed.

## 2. Run locally
```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

## 3. Push to GitHub (repo named GOD)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# create an empty repo named GOD at https://github.com/new, then:
git remote add origin https://github.com/YOUR-USERNAME/GOD.git
git push -u origin main
```
Or with GitHub CLI: `gh repo create GOD --public --source=. --push`

## 4. Deploy on Vercel
1. https://vercel.com/new → import the `GOD` repo.
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` (optional `ANTHROPIC_MODEL`).
3. Deploy. Every push to `main` redeploys.

## Managing content
- **Services:** Supabase → Table Editor → `services` (add title, time, and a YouTube Live / Zoom / Meet link in `stream_url`).
- **AI personalities and safety rules:** `lib/personas.ts`.

## Notes
- The AI personas always identify as AI and are not real clergy or Jesus. Keep the footer disclaimers.
- Keep `ANTHROPIC_API_KEY` server-side only (never prefix with `NEXT_PUBLIC_`). Consider adding rate limiting before a public launch to control API cost.
