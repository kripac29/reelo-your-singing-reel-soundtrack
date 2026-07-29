import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { moods } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { CreatorAvatar } from "@/components/CreatorAvatar";
import { ReelCover } from "@/components/ReelCover";
import { useReels } from "@/lib/reels-store";
import { usePlaylists } from "@/lib/playlist-store";
import { useAuth } from "@/lib/auth-store";
import { Instagram, Plus, Bookmark, Sparkles } from "lucide-react";
import { getTrackCover, normalizeCreatorName } from "@/lib/reel-utils";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const { reels: saved } = useReels();
  const { playlists } = usePlaylists();
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const recent = saved.slice(0, 6);
  const totalSaved = saved.length;
  const creatorMap = new Map<string, string>();
  saved.forEach((track) => creatorMap.set(normalizeCreatorName(track.artist), track.thumbnailUrl || track.thumbnail || ""));
  const creators = Array.from(creatorMap.entries()).map(([name, image]) => ({ name, image }));

  return (
    <div className="space-y-12">
      {/* Personal greeting + scrapbook stats */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{greet}{user?.name ? `, ${user.name}` : ""} ✦</h1>
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

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat icon={<Bookmark className="w-4 h-4" />} value={totalSaved} label="reels saved" />
          <Stat icon={<Sparkles className="w-4 h-4" />} value={playlists.length} label="mood folders" />
          <Stat icon={<Instagram className="w-4 h-4" />} value={creators.length} label="creators bookmarked" />
        </div>
      </motion.section>

      {/* Continue listening */}
      <Section title="Pick up where you stopped" subtitle="Your last few replays">
        {recent.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">Your scrapbook is empty. Save a reel to see your last replays here.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((t) => (
              <button key={t.id} className="flex items-center gap-3 glass rounded-xl p-2 pr-4 group hover:bg-white/5 transition text-left">
                <div className="w-14 h-14 rounded-lg overflow-hidden">
                  <ReelCover src={getTrackCover(t)} alt={t.title} className="w-full h-full rounded-lg" fallbackLabel="Reel cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition">{t.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.artist} · saved {t.savedAt}</div>
                </div>
              </button>
            ))}
          </div>
        )}
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
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {creators.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">No creators yet — save a reel and Reelo will surface the artist here.</div>
          ) : (
            creators.map((creator) => (
              <div
                key={creator.name}
                className="glass rounded-2xl p-5 text-center group min-w-[220px] flex-shrink-0"
              >
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition">
                  <CreatorAvatar name={creator.name} src={creator.image} className="w-28 h-28" />
                </div>
                <div className="mt-4 font-medium">{creator.name}</div>
                <div className="text-xs text-muted-foreground">{saved.filter((t) => normalizeCreatorName(t.artist) === creator.name).length} reels saved</div>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Recently saved scrapbook */}
      <Section title="Recently saved" subtitle="Fresh from your Instagram saves">
        {saved.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">There are no saved reels yet — paste an Instagram reel link from the Save a reel screen.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {saved.map((t) => <MusicCard key={t.id} track={t} queue={saved} />)}
          </div>
        )}
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
