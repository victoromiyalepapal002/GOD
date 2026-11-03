export default function Loading() {
  return (
    <div className="space-y-4 py-10" role="status" aria-label="Loading">
      <div className="skeleton h-12 w-2/3" />
      <div className="skeleton h-5 w-1/2" />
      <div className="skeleton mt-8 h-48 w-full" />
    </div>
  );
}
