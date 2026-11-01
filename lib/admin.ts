import type { User } from "@supabase/supabase-js";

// Admins are the confirmed email addresses listed in the ADMIN_EMAILS env var (comma separated).
export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.email || !user.email_confirmed_at) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(user.email.toLowerCase());
}
