import { Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";

export function TopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      // The local session is cleared even when the server cannot be reached.
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-border/50">
      <div className="flex items-center gap-3 px-4 lg:px-8 py-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search your saved reels, creators, moods..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-white/10 transition"
          />
        </div>
        <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition">
          <Bell className="w-4 h-4" />
        </button>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:border-primary/60 hover:text-primary transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}
