# Sons of God

A faith website: personal visions and horoscope-style words, an AI "Man of God" pastor chat, an AI "Jesus" chat (inspired by the Gospels), live services, a prayer wall, daily verse and devotional, an online Bible, music and sermons, a Heaven and Hell guide, and a free "Sons of God" membership card.

**Stack:** Next.js 14 (App Router) · Tailwind · Supabase (auth + database) · free AI (Gemini, Groq, OpenRouter with automatic failover) · Vercel

## 1. Supabase
1. Create a project at https://supabase.com.
2. SQL Editor → run `supabase/schema.sql`, then `supabase/ai_providers.sql`, then `supabase/giving.sql`, then `supabase/content.sql` (devotionals, music and sermons, membership cards, prayer moderation). All are safe to run again.
3. Project Settings → API → copy the **Project URL**, the **anon key** and the **service_role key**.
4. Authentication → URL Configuration → set Site URL to your Vercel URL once deployed.

## 2. Environment variables
Copy `.env.example` to `.env.local` for local use, and add the same values in Vercel → Project → Settings → Environment Variables:

| Name | What it is |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (secret, server only) |
| `ADMIN_EMAILS` | Your email. Comma separate several. |
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` | Optional. You can paste keys on the Admin page instead. |

## 3. Run locally
```bash
npm install
npm run dev
```

## 4. Deploy on Vercel
1. https://vercel.com/new → import this repo.
2. Add the environment variables above.
3. Deploy. Every push to `main` redeploys.

## 5. Set up the AI (Admin page)
1. Sign up on the site with the email in `ADMIN_EMAILS` and confirm it from your inbox.
2. Open **Admin** in the menu.
3. For Gemini, Groq and OpenRouter: paste a free key (links are on the page), edit the model if you want, then **Save changes**.
4. Press **Test saved settings** on each one.
5. Use the arrows to choose the order. Number 1 answers first. If it fails or hits its free limit, number 2 answers, then number 3. Untick **Enabled** to turn one off.

Free tiers have limits, and free model names change over time. When a model stops working, change its name on the Admin page; no code change or redeploy is needed. Model names: Gemini at https://ai.google.dev/gemini-api/docs/models, Groq at https://console.groq.com/docs/models, OpenRouter at https://openrouter.ai/models (filter by free).

Keys saved on the Admin page are stored in the `ai_providers` table, which the browser cannot read. They are not encrypted at rest beyond Supabase's own storage, so use free-tier keys only and keep your Supabase service_role key secret.

## 6. Set up giving (tithe and donation)
1. Open **Admin** → **Giving**.
2. Click **Add a giving method**. Give it a name (for example "GTBank transfer"), choose whether it is for tithe, donation or both, and add a payment link (Paystack, Flutterwave, PayPal, Stripe) and/or your account details.
3. **Save giving details**. The **Give** page updates straight away; no redeploy needed.

The site never handles money. Visitors either open your payment link or copy your account details and pay from their own bank. Check every number and link twice.

## Heaven and Hell
`/heaven` and `/hell` each have a themed look, a light 3D scene and an AI guide that answers from the Bible. Visitors must sign in. The guide uses whichever AI you have set first on the Admin page, with the same failover. To change how it speaks or what it avoids, edit `lib/realmPrompts.ts`; to change the starter questions, edit `lib/realms.ts`. These conversations are not saved.

Each page also shows four biblical beings with their own CSS 3D figure: Michael, Gabriel, the Seraphim and the Cherubim in heaven; Satan, Lucifer, Abaddon and Beelzebub in hell. Their names, meanings, verses and notes are in `lib/beings.ts`, and the figures are in `components/Avatar.tsx` and the end of `app/globals.css`. "Ask about …" sends a question to the AI guide. The figures are plain CSS (no images or 3D library) and pause when off screen.

## Daily faith features
- **Verse of the day** (`/verse`, and on the home page): built-in King James text, a different verse each date (`lib/verses.ts`).
- **Daily devotional** (`/devotional`): if you wrote one for the day in Admin, that shows. Otherwise the AI writes one from the day's verse, saves it, and labels it as AI-written. Edit or replace any day in Admin → Devotionals.
- **Online Bible** (`/bible`): read and search 66 books in KJV, WEB and YLT (all public domain) through the free bolls.life API, cached on the server. If it is ever down, KJV falls back to other free sources (`lib/bibleApi.ts`). I could not test the live API from my build environment, so open `/bible` once after deploying.
- **Prayer** (`/prayer`): written prayers plus the prayer wall. Hide or delete requests in Admin → Prayer wall.
- **Music and sermons** (`/media`): add YouTube, Spotify or direct audio links in Admin. No copyrighted audio is bundled.
- **About God and salvation** (`/about-god`): the gospel explained simply, with FAQs.
- **Sons of God card** (`/sons-of-god`): signed-in visitors make a free Son, Daughter or Child of God card with a number, and download it as an image.
- **Book of Life** (`/book-of-life`): a private journal for signed-in visitors: prayers (mark answered), thankfulness, Scripture notes and testimonies. Only the author can read their pages (row level security).
- **The Great Debate** (`/debate`): in Admin → Debates add a topic. Jesus and the devil (AI portrayals) debate it, the devil opening and Jesus closing. Press "Start and write all" to write it at once, or "Go live" and visitors' browsers advance it one speech every 35 seconds. The page lists live, up next and past debates. Prompts are in `lib/debate.ts`. The AI can misquote verses, so the page tells readers to check them.
- **View counter**: every main page shows its total views (one per visitor per browser session). Pages that count are listed in `lib/views.ts`.
- Time zone for "today" is `NEXT_PUBLIC_TZ` (default `Africa/Lagos`).

## Managing content
- **Services:** Supabase → Table Editor → `services` (title, time, and a YouTube Live / Zoom / Meet link in `stream_url`).
- **AI personalities and safety rules:** `lib/personas.ts`.
- **AI failover logic:** `lib/llm.ts`.

## Design
Glass surfaces, a CSS 3D glass cross inside orbiting rings, a halo moon, a slow constellation ring and rising spirit motes. No 3D library, so pages stay fast. Motion switches off for visitors who prefer reduced motion.

## Notes
- The AI personas always identify as AI and are not real clergy or Jesus. Keep the footer disclaimers.
- Never prefix any AI key or the service_role key with `NEXT_PUBLIC_`.
