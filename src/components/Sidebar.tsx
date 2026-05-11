import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Library, ListMusic, Heart, Clock, Settings, Plus } from "lucide-react";
import logo from "@/assets/reelo-logo.png";
import { playlists } from "@/lib/mock-data";

const nav = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/discover", label: "Discover", icon: Compass, exact: false },
  { to: "/app/library", label: "Library", icon: Library, exact: false },
  { to: "/app/favorites", label: "Favorites", icon: Heart, exact: false },
  { to: "/app/recent", label: "Recently Played", icon: Clock, exact: false },
  { to: "/app/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 p-4 gap-3">
      <Link to="/" className="flex items-center gap-2 px-2 py-3">
        <img src={logo} alt="Reelo" className="w-9 h-9 rounded-lg glow" />
        <span className="font-display text-xl font-bold text-gradient">Reelo</span>
      </Link>

      <nav className="glass rounded-2xl p-2 flex flex-col gap-1">
        {nav.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary glow" />}
            </Link>
          );
        })}
      </nav>

      <div className="glass rounded-2xl p-3 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Playlists</span>
          <button className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-primary transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1">
          {playlists.map((p) => (
            <Link
              key={p.id}
              to="/app/playlist/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group"
            >
              <img src={p.cover} alt="" className="w-9 h-9 rounded-md object-cover" loading="lazy" />
              <div className="min-w-0">
                <div className="text-sm truncate group-hover:text-primary transition">{p.title}</div>
                <div className="text-xs text-muted-foreground truncate">{p.count} reels</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link to="/app/library" className="flex items-center gap-3 glass rounded-2xl p-3 hover:bg-white/5 transition">
        <div className="w-9 h-9 rounded-full gradient-brand grid place-items-center text-sm font-bold">R</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">Reelo User</div>
          <div className="text-xs text-muted-foreground truncate">Free tier</div>
        </div>
        <ListMusic className="w-4 h-4 text-muted-foreground" />
      </Link>
    </aside>
  );
}
