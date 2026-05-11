import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Library, Heart } from "lucide-react";

const items = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/discover", label: "Discover", icon: Compass, exact: false },
  { to: "/app/library", label: "Library", icon: Library, exact: false },
  { to: "/app/favorites", label: "Favorites", icon: Heart, exact: false },
] as const;

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-24 left-3 right-3 z-40 glass-strong rounded-2xl flex justify-around p-2">
      {items.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        return (
          <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 p-2 rounded-xl flex-1 transition ${active ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
