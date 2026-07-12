import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { AudioEngine } from "@/components/AudioEngine";
import { MobileNav } from "@/components/MobileNav";
import { PlayerProvider } from "@/lib/player-store";
import logo from "@/assets/reelo-logo.png";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <PlayerProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="" className="w-7 h-7 rounded" />
              <span className="font-display font-bold text-gradient">Reelo</span>
            </Link>
          </div>
          <TopBar />
          <main className="flex-1 px-4 lg:px-8 py-6 pb-40">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
      <AudioEngine />
      <FloatingPlayer />
    </PlayerProvider>
  );
}
