import { createFileRoute } from "@tanstack/react-router";
import { tracks, moods, artists } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/discover")({ component: Discover });

function Discover() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Discover</h1>
        <p className="text-muted-foreground mt-1">New voices, fresh moods, AI-picked just for you.</p>
      </header>

      <section className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full gradient-brand opacity-25 blur-3xl" />
        <div className="relative flex items-center gap-3 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-semibold">AI Recommendations</span>
        </div>
        <h2 className="relative font-display text-2xl md:text-3xl font-bold mt-3">Because you replayed “Midnight Velvet” 14 times…</h2>
        <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {tracks.slice(2, 7).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-5">Browse Moods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((m) => (
            <div key={m.name} className={`relative aspect-[4/3] rounded-2xl p-4 bg-gradient-to-br ${m.gradient} overflow-hidden cursor-pointer hover:scale-[1.02] transition`}>
              <span className="font-display text-xl font-bold">{m.name}</span>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl rotate-12 bg-black/30 backdrop-blur" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-5">Trending Singers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artists.map((a) => (
            <div key={a.name} className="glass rounded-2xl overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="font-display font-bold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.followers} reels saved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
