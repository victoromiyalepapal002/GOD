import SonsOfGod from "@/components/SonsOfGod";

export const metadata = { title: "Sons of God card: GOD" };

export default function SonsOfGodPage() {
  return (
    <div className="py-8">
      <h1 className="page-title">Sons of God</h1>
      <p className="page-lead max-w-2xl">
        Make your free membership card, save it as a picture and share it. Choose Son, Daughter or Child of God, because the promise is for everyone who believes.
      </p>

      <blockquote className="mt-6 max-w-2xl border-l-2 border-gold/60 pl-4">
        <p className="font-serif text-lg italic leading-relaxed text-ivory/90 md:text-xl">
          “But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name.”
        </p>
        <footer className="mt-1 text-sm font-semibold text-gold">John 1:12</footer>
      </blockquote>

      <div className="mt-10">
        <SonsOfGod />
      </div>

      <p className="mt-10 max-w-2xl text-sm text-ivory/50">
        This card is for encouragement and fun. It is not a church membership, a baptism record or an ID.
      </p>
    </div>
  );
}
