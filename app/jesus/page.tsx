import Chat from "@/components/Chat";

export default function Jesus() {
  return (
    <div className="py-8">
      <h1 className="mb-1 text-3xl font-bold text-gold">Talk to Jesus (AI)</h1>
      <p className="mb-4 text-white/70">
        An AI inspired by the Gospels. It is not the real Jesus and can make mistakes; read the Bible for yourself.
      </p>
      <Chat persona="jesus" />
    </div>
  );
}
