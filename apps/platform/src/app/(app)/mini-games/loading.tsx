export default function MiniGamesLoading() {
  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fff5e8] px-6 text-center text-[#0e0e0e]"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-[#f8dc03] border-t-[#0e0e0e] motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="text-xl font-extrabold">Opening mini games…</p>
      <p className="text-sm text-[#3a3f39]">Getting everything ready for you.</p>
    </section>
  );
}
