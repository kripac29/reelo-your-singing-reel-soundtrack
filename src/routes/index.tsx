import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bookmark, ListMusic, Sparkles, Headphones, Play, ArrowRight, Chrome, Heart, Wand2 } from "lucide-react";
import { artistUrls, coverUrls, logoDataUri } from "@/lib/image-assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reelo — Turn saved singing reels into your own Spotify" },
      { name: "description", content: "Reelo organizes your favorite singing reels into a Spotify-style listening experience. Mood playlists, uninterrupted playback, AI recommendations." },
      { property: "og:title", content: "Reelo — Your singing reels, now a music app" },
      { property: "og:description", content: "Save, organize and continuously play your favorite singing reels." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoDataUri} alt="Reelo" className="w-9 h-9 rounded-lg" />
            <span className="font-display font-bold text-xl text-gradient">Reelo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#preview" className="hover:text-foreground transition">Preview</a>
            <a href="#testimonials" className="hover:text-foreground transition">Loved by</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm rounded-full border border-white/10 hover:border-primary/60 transition hidden sm:inline-flex">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 text-sm rounded-full gradient-brand text-white font-medium glow">Get Reelo</Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs glass border border-white/10 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary glow" /> Built for singing-reel obsessives
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Your saved reels, <br />
              now an entire <span className="text-gradient">music app.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Stop scrolling messy saved folders. Reelo turns the singing reels you replay into mood playlists, queues and uninterrupted listening — like Spotify, but personal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full gradient-brand text-white font-semibold shadow-[0_20px_60px_-15px_oklch(0.72_0.3_350/0.6)] hover:scale-[1.02] transition">
                Open Reelo <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#preview" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass border border-white/10 hover:border-primary/40 transition">
                <Play className="w-4 h-4" /> See the player
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                <img src={artistUrls[0]} className="w-8 h-8 rounded-full border-2 border-background object-cover" alt="" />
                <img src={artistUrls[1]} className="w-8 h-8 rounded-full border-2 border-background object-cover" alt="" />
                <img src={artistUrls[0]} className="w-8 h-8 rounded-full border-2 border-background object-cover" alt="" />
              </div>
              <span>Loved by <strong className="text-foreground">12,400+</strong> reel listeners</span>
            </div>
          </motion.div>
        </div>

        {/* hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-[radial-gradient(circle,oklch(0.72_0.3_350/0.35),transparent_60%)] blur-3xl" />
          <div className="relative glass-strong rounded-3xl p-5 shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6)] float-slow">
            <div className="flex items-center gap-4">
              <img src={coverUrls[0]} className="w-28 h-28 rounded-2xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">NOW PLAYING</div>
                <div className="font-display text-xl font-bold mt-1 truncate">Midnight Velvet</div>
                <div className="text-sm text-muted-foreground">Aria Wren · Late Night Singing</div>
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 gradient-brand rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5"><span>0:54</span><span>2:14</span></div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[coverUrls[1], coverUrls[2], coverUrls[0]].map((c, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-square relative">
                  <img src={c} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent grid place-items-end p-2">
                    <span className="text-[10px] font-medium">Reel #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-1 h-10">
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="w-1 gradient-brand rounded-full eq-bar" style={{ animationDelay: `${i * 0.06}s`, height: `${20 + Math.sin(i) * 30 + 30}%` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Built for the way you actually <span className="text-gradient">listen.</span></h2>
          <p className="mt-4 text-muted-foreground">Six features that make saved reels finally feel like music.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {[
            { i: Bookmark, t: "Save in one tap", d: "Capture singing reels straight from Instagram with the Reelo extension." },
            { i: ListMusic, t: "Mood playlists", d: "Late-night, heartbreak, dreamy — auto-tagged into the right vibe." },
            { i: Headphones, t: "Continuous play", d: "Queue, shuffle, loop. No more tapping every 30 seconds." },
            { i: Sparkles, t: "AI recommendations", d: "Find covers that match the singers you already love." },
            { i: Wand2, t: "Similar voices", d: "Discover hidden artists with the same texture and tone." },
            { i: Heart, t: "Personal library", d: "Favorites, recents and custom collections — all in one place." },
          ].map(({ i: Icon, t, d }) => (
            <motion.div key={t} whileHover={{ y: -4 }} className="glass rounded-2xl p-6 group">
              <div className="w-11 h-11 rounded-xl gradient-brand grid place-items-center text-white shadow-[0_8px_30px_oklch(0.72_0.3_350/0.4)]">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* preview / testimonials */}
      <section id="preview" className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-strong rounded-3xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full gradient-brand opacity-20 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-10 items-center relative">
            <div>
              <Chrome className="w-8 h-8 text-primary" />
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold">One click from Instagram, forever in your library.</h2>
              <p className="mt-4 text-muted-foreground">The Reelo Chrome extension lets you save any singing reel with a single tap. We strip the audio, tag the mood, and drop it straight into your playlists.</p>
              <Link to="/signup" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-brand text-white font-medium">
                Join the waitlist <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[coverUrls[0], coverUrls[1], coverUrls[2], coverUrls[0]].map((c, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden aspect-square ${i % 2 ? "translate-y-6" : ""}`}>
                  <img src={c} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="testimonials" className="grid md:grid-cols-3 gap-5 mt-16">
          {[
            { q: "I had 600+ saved reels. Reelo turned them into the most personal playlist I've ever owned.", a: "Maya, 22" },
            { q: "Finally I can sleep to my favorite covers without opening Instagram.", a: "Aarav, 19" },
            { q: "The mood tagging is scary good. 'Heartbreak' hit different at 1 a.m.", a: "Zoe, 24" },
          ].map(({ q, a }) => (
            <div key={a} className="glass rounded-2xl p-6">
              <p className="text-sm leading-relaxed">"{q}"</p>
              <div className="mt-4 text-xs text-muted-foreground">— {a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold">Press play on <span className="text-gradient">your reels.</span></h2>
        <p className="mt-5 text-muted-foreground">Free during beta. No ads, no algorithm — just your voice library.</p>
        <Link to="/signup" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-brand text-white font-semibold text-lg shadow-[0_20px_60px_-15px_oklch(0.72_0.3_350/0.6)]">
          Start listening <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logoDataUri} alt="" className="w-6 h-6 rounded" />
            <span>© 2026 Reelo. Made for singers and listeners.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Terms</a>
            <a href="#" className="hover:text-foreground transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
