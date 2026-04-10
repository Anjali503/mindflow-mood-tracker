import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050510] relative overflow-hidden text-slate-200">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-violet-600/20 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[680px] h-[680px] bg-indigo-600/10 rounded-full blur-[170px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 md:p-10 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8">
        {children}
      </main>
    </div>
  );
}
