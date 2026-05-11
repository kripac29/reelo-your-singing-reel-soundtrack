import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, ListMusic, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/player-store";
import { useState } from "react";

export function FloatingPlayer() {
  const p = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  if (!p.current) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="fixed bottom-3 left-3 right-3 lg:left-6 lg:right-6 z-50"
      >
        <div className="glass-strong rounded-2xl px-3 py-2.5 lg:px-4 lg:py-3 flex items-center gap-3 lg:gap-4 shadow-[0_20px_60px_-20px_oklch(0_0_0/0.6)]">
          {/* Track */}
          <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-none lg:w-72">
            <div className="relative">
              <img src={p.current.cover} alt="" className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover" />
              {p.isPlaying && (
                <div className="absolute inset-0 rounded-xl ring-2 ring-primary/60 animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{p.current.title}</div>
              <div className="text-xs text-muted-foreground truncate">{p.current.artist}</div>
            </div>
            <button className="ml-auto lg:ml-2 p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition hidden sm:grid place-items-center">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex-1 hidden md:flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <button onClick={p.toggleShuffle} className={`p-2 rounded-full hover:bg-white/5 transition ${p.shuffle ? "text-primary" : "text-muted-foreground"}`}>
                <Shuffle className="w-4 h-4" />
              </button>
              <button onClick={p.prev} className="p-2 rounded-full hover:bg-white/5 text-foreground transition">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={p.toggle}
                className="w-10 h-10 rounded-full gradient-brand grid place-items-center text-white shadow-[0_0_20px_oklch(0.72_0.3_350/0.6)] hover:scale-105 transition"
              >
                {p.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button onClick={p.next} className="p-2 rounded-full hover:bg-white/5 text-foreground transition">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={p.toggleLoop} className={`p-2 rounded-full hover:bg-white/5 transition ${p.loop ? "text-primary" : "text-muted-foreground"}`}>
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full flex items-center gap-2 px-2">
              <span className="text-[10px] text-muted-foreground tabular-nums">0:48</span>
              <div
                className="flex-1 h-1 rounded-full bg-white/10 cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  p.setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${p.progress}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">{p.current.duration}</span>
            </div>
          </div>

          {/* Mobile play button */}
          <button onClick={p.toggle} className="md:hidden w-10 h-10 rounded-full gradient-brand grid place-items-center text-white">
            {p.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-2 w-56 justify-end">
            <button onClick={() => setShowQueue((s) => !s)} className={`p-2 rounded-full hover:bg-white/5 transition ${showQueue ? "text-primary" : "text-muted-foreground"}`}>
              <ListMusic className="w-4 h-4" />
            </button>
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full gradient-brand rounded-full" style={{ width: `${p.volume}%` }} />
            </div>
            <button className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="hidden lg:flex flex-col fixed right-6 bottom-28 top-24 w-80 glass-strong rounded-2xl p-4 z-40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">Up Next</h3>
              <span className="text-xs text-muted-foreground">{p.queue.length} tracks</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1">
              {p.queue.map((t) => (
                <button
                  key={t.id}
                  onClick={() => p.play(t)}
                  className={`flex items-center gap-3 p-2 rounded-lg text-left transition ${
                    p.current?.id === t.id ? "bg-primary/15 text-primary" : "hover:bg-white/5"
                  }`}
                >
                  <img src={t.cover} alt="" className="w-10 h-10 rounded-md object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.artist}</div>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">{t.duration}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
