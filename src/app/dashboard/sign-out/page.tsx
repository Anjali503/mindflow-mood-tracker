export default function SignOutPage() {
  // Placeholder: wire to auth later. For local single-user mode, we just link back.
  return (
    <div className="max-w-3xl mx-auto w-full pt-10 pb-20">
      <div className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-glass">
        <h1 className="text-2xl font-bold text-white">Signed out</h1>
        <p className="text-white/50 mt-2">
          Authentication is not enabled in this local build yet.
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="/"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-900/40 hover:brightness-110 transition"
          >
            Back to landing
          </a>
          <a
            href="/dashboard"
            className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

