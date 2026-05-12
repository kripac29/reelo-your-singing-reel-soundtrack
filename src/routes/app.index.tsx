import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { tracks, playlists, moods, artists } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { Instagram, Plus, Bookmark, Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const recent = tracks.slice(0, 6);
  const totalSaved = tracks.length + 142; // mock
  const totalCreators = artists.length + 21;

  return (
    <div className="space-y-12">
      {/* Personal greeting + scrapbook stats */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{greet} ✦</h1>
            <p className="text-muted-foreground mt-1">Your private scrapbook of singing reels — saved, sorted, always with you.</p>
          </div>
          <Link
            to="/app/discover"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full gradient-brand text-white text-sm font-medium shadow-[0_10px_30px_oklch(0.72_0.3_350/0.4)] hover:opacity-95 transition"
          >
            <Instagram className="w-4 h-4" />
            Save a reel
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={<Bookmark className="w-4 h-4" />} value={totalSaved} label="reels saved" />
          <Stat icon={<Sparkles className="w-4 h-4" />} value={playlists.length} label="mood folders" />
          <Stat icon={<Instagram className="w-4 h-4" />} value={totalCreators} label="creators bookmarked" />
          <Stat icon={<Clock className="w-4 h-4" />} value={"4.2h"} label="listened this week" />
        </div>
      </motion.section>

      {/* Continue listening */}
      <Section title="Pick up where you stopped" subtitle="Your last few replays">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recent.slice(0, 6).map((t) => (
            <button key={t.id} className="flex items-center gap-3 glass rounded-xl p-2 pr-4 group hover:bg-white/5 transition text-left">
              <img src={t.cover} alt="" className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate group-hover:text-primary transition">{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist} · saved {t.savedAt}</div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Mood folders — pinterest-style boards */}
      <Section title="Your mood folders" subtitle="Boards you built from the reels you loved">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((p) => <PlaylistCard key={p.id} {...p} />)}
          <button className="aspect-square rounded-2xl border-2 border-dashed border-white/15 hover:border-primary/60 hover:bg-white/5 transition flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary">
            <Plus className="w-6 h-6" />
            <span className="text-xs">New folder</span>
          </button>
        </div>
      </Section>

      {/* Mood quick filters */}
      <Section title="Browse by feeling" subtitle="Jump into a vibe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((m) => (
            <motion.button key={m.name} whileHover={{ y: -3 }} className={`relative aspect-[4/3] rounded-2xl overflow-hidden p-4 text-left bg-gradient-to-br ${m.gradient}`}>
              <span className="font-display text-xl font-bold drop-shadow-md">{m.name}</span>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl rotate-12 bg-black/30 backdrop-blur" />
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Bookmarked creators */}
      <Section title="Creators you bookmarked" subtitle="Singers from your saved reels">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {artists.map((a) => (
            <div key={a.name} className="glass rounded-2xl p-5 text-center group">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="mt-4 font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.followers}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Recently saved scrapbook */}
      <Section title="Recently saved" subtitle="Fresh from your Instagram saves">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {recent.map((t) => <MusicCard key={t.id} track={t} queue={recent} />)}
        </div>
      </Section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span></div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-xs text-muted-foreground hover:text-primary transition uppercase tracking-widest">See all</button>
      </div>
      {children}
    </section>
  );
}
