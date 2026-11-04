// SERVER ONLY. Writes the debate one turn at a time: the devil opens, Jesus answers, and so on.
// Jesus always has the last word. Both sides are AI portrayals for teaching.
import { createAdminClient } from "@/lib/supabase/admin";
import { chatComplete } from "@/lib/llm";

export type Speaker = "jesus" | "devil";
export type TurnResult =
  | { state: "added"; seq: number; finished: boolean }
  | { state: "wait" }
  | { state: "done" }
  | { state: "notlive" }
  | { state: "error"; message: string };

const PACE_MS = 35_000; // public visitors advance the debate at most one turn per 35 seconds
const LOCK_MS = 60_000;

const SHARED = `This is a teaching drama on a church website. It is written by an AI, so it is a portrayal and not the real words of anyone.
Write ONE speech of 70 to 120 words in plain English, with no stage directions, no speaker label and no markdown.
Speak directly to the other side. Quote one or two Bible verses, in King James wording, with book, chapter and verse. Only quote verses you are sure of; never invent a reference.
Never include instructions for harm, self-harm, violence, hatred, sexual content or anything unsafe. Keep it suitable for all ages.`;

const JESUS = `You portray Jesus Christ in a debate with the devil. Be calm, loving, humble and completely sure. Answer as He did in the wilderness (Matthew 4): "It is written", using the whole of Scripture in its true meaning. Expose the twist in the devil's argument gently, answer the real question underneath, and point to grace, truth and the cross. Never insult, never boast.
${SHARED}`;

const DEVIL = `You portray the devil in a debate with Jesus, as the tempter, the accuser and the deceiver (Genesis 3, Job 1, Matthew 4, Revelation 12:10). Be clever and persuasive. Take the tempting, doubting, worldly or accusing side of the topic, and bend Scripture the way he did in Matthew 4:6, so the deception is visible to a careful reader. Be cunning, never crude. Do not claim to win. Do not tempt the reader toward real harm.
${SHARED}`;

function clean(text: string): string {
  return text
    .replace(/^\s*(?:\*\*)?(?:jesus|the devil|devil|satan)(?:\*\*)?\s*:\s*/i, "")
    .replace(/^["“]|["”]$/g, "")
    .replace(/\*\*/g, "")
    .trim()
    .slice(0, 1100);
}

export async function generateTurn(debateId: string, force = false): Promise<TurnResult> {
  const db = createAdminClient();
  const { data: d } = await db.from("debates").select("id, topic, status, rounds").eq("id", debateId).maybeSingle();
  if (!d || d.status !== "live") return { state: "notlive" };

  const total = Number(d.rounds) * 2;
  const { data: rows } = await db
    .from("debate_turns").select("seq, speaker, body, created_at").eq("debate_id", debateId).order("seq", { ascending: true });
  const turns = (rows ?? []) as { seq: number; speaker: Speaker; body: string; created_at: string }[];

  if (turns.length >= total) {
    await db.from("debates").update({ status: "finished", finished_at: new Date().toISOString() }).eq("id", debateId);
    return { state: "done" };
  }
  const last = turns[turns.length - 1];
  if (!force && last && Date.now() - new Date(last.created_at).getTime() < PACE_MS) return { state: "wait" };

  // Take a short lock so two visitors cannot write the same turn.
  const now = new Date();
  const { data: claimed } = await db
    .from("debates")
    .update({ lock_until: new Date(now.getTime() + LOCK_MS).toISOString() })
    .eq("id", debateId)
    .or(`lock_until.is.null,lock_until.lt.${now.toISOString()}`)
    .select("id");
  if (!claimed || claimed.length === 0) return { state: "wait" };

  try {
    const seq = turns.length + 1;
    const speaker: Speaker = seq % 2 === 1 ? "devil" : "jesus";
    const isLast = seq === total;
    const transcript = turns.map((t) => `${t.speaker === "jesus" ? "JESUS" : "THE DEVIL"}: ${t.body}`).join("\n\n");
    const task =
      seq === 1
        ? "Open the debate: make your strongest case on this topic and challenge Jesus."
        : isLast
          ? "Give the closing word: answer the last point, sum up the truth of Scripture on this topic, and end with a gracious invitation to the reader."
          : "Answer the last speech directly and press your side further.";
    const { text } = await chatComplete(
      [
        { role: "system", content: speaker === "jesus" ? JESUS : DEVIL },
        { role: "user", content: `Debate topic: ${d.topic}\n\n${transcript ? `Debate so far:\n${transcript}\n\n` : ""}Your task: ${task}` },
      ],
      500
    );
    const body = clean(text);
    if (!body) return { state: "error", message: "The AI returned nothing." };

    const { error } = await db.from("debate_turns").insert({ debate_id: debateId, seq, speaker, body });
    if (error) return { state: "wait" }; // someone else wrote this turn first
    if (isLast) {
      await db.from("debates").update({ status: "finished", finished_at: new Date().toISOString() }).eq("id", debateId);
    }
    return { state: "added", seq, finished: isLast };
  } catch (e) {
    return { state: "error", message: e instanceof Error ? e.message : "The AI could not answer." };
  } finally {
    await db.from("debates").update({ lock_until: null }).eq("id", debateId);
  }
}
