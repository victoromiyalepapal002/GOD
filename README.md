# GOD

A faith website: personal visions and horoscope-style words, an AI "Man of God" pastor chat, an AI "Jesus" chat (inspired by the Gospels), live services, and a prayer wall.

**Stack:** Next.js 14 (App Router) · Tailwind · Supabase (auth + database) · free AI (Gemini, Groq, OpenRouter with automatic failover) · Vercel

## 1. Supabase
1. Create a project at https://supabase.com.
2. SQL Editor → run `supabase/schema.sql`, then `supabase/ai_providers.sql`, then `supabase/giving.sql`.
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

## Managing content
- **Services:** Supabase → Table Editor → `services` (title, time, and a YouTube Live / Zoom / Meet link in `stream_url`).
- **AI personalities and safety rules:** `lib/personas.ts`.
- **AI failover logic:** `lib/llm.ts`.

## Design
Glass surfaces, a CSS 3D glass cross inside orbiting rings, a halo moon, a slow constellation ring and rising spirit motes. No 3D library, so pages stay fast. Motion switches off for visitors who prefer reduced motion.

## Notes
- The AI personas always identify as AI and are not real clergy or Jesus. Keep the footer disclaimers.
- Never prefix any AI key or the service_role key with `NEXT_PUBLIC_`.
