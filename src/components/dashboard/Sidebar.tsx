'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenLine,
  BookOpenText,
  Sparkles,
  CalendarDays,
  User2,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Log Mood', href: '/dashboard/log', icon: PenLine },
  { name: 'Journal', href: '/dashboard/journal', icon: BookOpenText },
  { name: 'Insights', href: '/dashboard/insights', icon: Sparkles },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
  { name: 'Profile', href: '/dashboard/profile', icon: User2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen border-r border-white/10 bg-gradient-to-b from-black/45 via-black/35 to-black/25 backdrop-blur-xl flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 shadow-lg shadow-violet-500/20 ring-1 ring-white/10" />
        <div className="leading-tight">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            MindFlow
          </div>
          <div className="text-xs text-white/35">Emotional analytics</div>
        </div>
      </div>

      {/* Profile mini-card */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/70">
            <User2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Local User</p>
            <p className="text-xs text-white/45 truncate">local@mindflow.app</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-white" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/15 to-cyan-500/10 rounded-xl border border-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-purple-400" : "group-hover:text-purple-400/70")} />
                <span className="font-medium relative z-10">{item.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
        <Link href="/dashboard/sign-out">
          <span className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5 cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </span>
        </Link>
        <Link href="/">
          <span className="flex items-center gap-3 px-4 py-2 text-white/30 hover:text-white/60 transition-colors rounded-xl hover:bg-white/5 cursor-pointer">
            <span className="text-xs font-medium">Back to landing</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
