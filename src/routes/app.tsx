import { createFileRoute, Link, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { AudioEngine } from "@/components/AudioEngine";
import { MobileNav } from "@/components/MobileNav";
import logo from "@/assets/reelo-logo.png";
import { getCurrentUser } from "@/lib/auth-store";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    // getCurrentUser handles 401/403/5xx/network failures and never lets them escape the guard.
    if (typeof window !== "undefined" && !(await getCurrentUser())) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <>
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
    </>
  );
}
