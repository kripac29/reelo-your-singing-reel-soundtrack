import { createFileRoute } from "@tanstack/react-router";
import { tracks, moods, artists } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { ArrowDownToLine, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/discover")({ component: Discover });

function Discover() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Import & organize</h1>
        <p className="text-muted-foreground mt-1">Bring your saved Instagram singing reels into folders, creators, and moods.</p>
      </header>

      <section className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full gradient-brand opacity-25 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 text-primary">
              <ArrowDownToLine className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">From Instagram → Reelo</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">Save a reel once. Listen forever.</h2>
            <p className="text-muted-foreground mt-3">
              Import your saved singing reels, then file them into mood folders and creator bookmarks. No public catalog — just your personal collection.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Late Night folder", "Heartbreak folder", "Acoustic folder", "Bookmarks", "History"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs glass border border-white/10 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Smart suggestions</span>
            </div>
            <div className="text-sm text-muted-foreground mt-2">Based on what you’ve saved (not what’s “trending”).</div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tracks.slice(2, 8).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-5">Mood folders</h2>
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
        <h2 className="font-display text-2xl font-bold mb-5">Creators you bookmark</h2>
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
