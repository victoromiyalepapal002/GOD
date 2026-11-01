import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: { user } } = await createClient().auth.getUser();

  if (!user) {
    return (
      <div className="card mt-8">
        Please <Link className="text-gold underline" href="/login">sign in</Link> to open the admin page.
      </div>
    );
  }
  if (!isAdmin(user)) {
    return (
      <div className="card mt-8">
        This account is not an admin. Add its email to <code>ADMIN_EMAILS</code> in your Vercel environment variables, then redeploy.
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gold">Admin</h1>
      <p className="mb-6 mt-1 max-w-xl text-ivory/70">
        Add keys, set each model, and choose which AI answers first. If one fails, the next one takes over.
      </p>
      <AdminPanel />
    </div>
  );
}
