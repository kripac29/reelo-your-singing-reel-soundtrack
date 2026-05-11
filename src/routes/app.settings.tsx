import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Tune Reelo to your taste.</p>
      </header>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-brand grid place-items-center text-2xl font-bold">R</div>
          <div>
            <div className="font-semibold">Reelo User</div>
            <div className="text-sm text-muted-foreground">user@reelo.app · Free tier</div>
          </div>
          <button className="ml-auto px-4 py-2 rounded-full text-sm gradient-brand text-white">Upgrade</button>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Listening preferences</h2>
        {[
          { l: "Autoplay similar reels", d: "Keep the vibe going when a playlist ends" },
          { l: "AI mood tagging", d: "Auto-categorize new saves" },
          { l: "Crossfade between reels", d: "Smooth transitions, no silence" },
          { l: "High-quality audio", d: "Stream lossless when available" },
        ].map((o, i) => (
          <Toggle key={o.l} label={o.l} desc={o.d} defaultOn={i !== 3} />
        ))}
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground">Change email</button>
        <button className="block text-sm text-muted-foreground hover:text-foreground">Change password</button>
        <button className="block text-sm text-destructive">Delete account</button>
      </section>
    </div>
  );
}

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
      <span className="w-11 h-6 rounded-full bg-white/10 relative transition peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}
