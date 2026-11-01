import Chat from "@/components/Chat";

export default function ManOfGod() {
  return (
    <div className="py-8">
      <h1 className="mb-1 text-3xl font-bold text-gold">AI Man of God</h1>
      <p className="mb-4 text-white/70">An AI pastoral companion. Not a real pastor.</p>
      <Chat persona="manofgod" />
    </div>
  );
}
