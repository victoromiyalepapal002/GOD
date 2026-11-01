"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMsg(error ? error.message : "Check your email to confirm, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else window.location.href = "/";
    }
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-4 text-3xl font-bold text-gold">{mode === "in" ? "Sign in" : "Create account"}</h1>
      <form onSubmit={submit} className="card space-y-3">
        <input className="input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn w-full">{mode === "in" ? "Sign in" : "Sign up"}</button>
        {msg && <p className="text-sm text-gold">{msg}</p>}
        <button type="button" className="text-sm text-white/70 underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
