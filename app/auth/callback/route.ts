import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google (and any OAuth) sends people back here with a one-time code.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // Only allow redirects to a page on this site.
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const { error } = await createClient().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safe}`);
  }
  return NextResponse.redirect(`${origin}/login?error=google`);
}
