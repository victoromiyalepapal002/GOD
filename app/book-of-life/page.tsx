import BookOfLife from "@/components/BookOfLife";

export const metadata = { title: "Book of Life" };

export default function BookOfLifePage() {
  return (
    <div className="py-8">
      <h1 className="page-title">Book of Life</h1>
      <p className="page-lead">
        Your own private book. Write your prayers, mark them answered, record what you are thankful for and keep the verses that spoke to you, so you can look back and remember what God has done.
      </p>

      <blockquote className="mt-6 max-w-2xl border-l-2 border-gold/60 pl-4">
        <p className="font-serif text-lg italic leading-relaxed text-ivory/90 md:text-xl">
          “Rejoice not, that the spirits are subject unto you; but rather rejoice, because your names are written in heaven.”
        </p>
        <footer className="mt-1 text-sm font-semibold text-gold">Luke 10:20</footer>
      </blockquote>

      <div className="mt-10">
        <BookOfLife />
      </div>

      <p className="mt-10 max-w-2xl text-sm text-ivory/50">
        Only you can read these pages. This journal is not the Book of Life in Revelation, which belongs to God alone. It is a place to remember His faithfulness.
      </p>
    </div>
  );
}
