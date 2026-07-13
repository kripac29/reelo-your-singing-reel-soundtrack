import { createFileRoute, Link } from "@tanstack/react-router";
import { logoDataUri } from "@/lib/image-assets";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return <AuthCard mode="login" />;
}

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.72_0.3_350/0.4),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.45_0.22_270/0.5),transparent_60%)]" />
        <div className="relative text-center space-y-6">
          <img src={logoDataUri} alt="" className="w-32 h-32 mx-auto rounded-3xl float-slow glow" />
          <h2 className="font-display text-4xl font-bold">Press play on <span className="text-gradient">your reels.</span></h2>
          <p className="text-muted-foreground max-w-sm mx-auto">A calmer, more personal way to listen to the singing reels you already love.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md glass-strong rounded-3xl p-8">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <img src={logoDataUri} alt="" className="w-8 h-8 rounded" />
            <span className="font-display font-bold text-gradient">Reelo</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{mode === "login" ? "Your library is waiting." : "Free during beta. No card required."}</p>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === "signup" && <Field label="Name" type="text" placeholder="Your name" />}
            <Field label="Email" type="email" placeholder="you@reelo.app" />
            <Field label="Password" type="password" placeholder="••••••••" />
            <Link to="/app" className="block text-center w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)]">
              {mode === "login" ? "Sign in" : "Create account"}
            </Link>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-white/10" /> OR <div className="flex-1 h-px bg-white/10" />
          </div>
          <button className="w-full py-3 rounded-full glass border border-white/10 hover:border-primary/40 transition text-sm font-medium">
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>New to Reelo? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...props} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/60 focus:bg-white/10 transition" />
    </label>
  );
}
