"use client";

import Link from "next/link";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Stories" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 px-4 py-12 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 md:flex-row md:items-start">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-display flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm shadow-glow">
              ◇
            </span>
            MindFlow
          </Link>
          <p className="mt-3 max-w-xs text-center text-sm text-slate-500 md:text-left">
            Intelligent mood tracking and emotional analytics for a calmer, clearer you.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:hello@mindflow.app" className="transition hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 pt-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} MindFlow. All rights reserved.
      </div>
    </footer>
  );
}
