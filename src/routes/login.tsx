import { createFileRoute, Link, Navigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { logoDataUri } from "@/lib/image-assets";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getCurrentUser, useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (typeof window !== "undefined" && await getCurrentUser()) throw redirect({ to: "/app" });
  },
  component: Login,
});

function Login() {
  return <AuthCard mode="login" />;
}

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) return null;
  if (user) return <Navigate to="/app" />;

  const handleLogin = async () => {
    try {
      setLoading(true);

      await signIn(email, password);
      navigate({ to: "/app" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (resend = false) => {
    if (!name.trim() || !email.trim() || !password) {
      alert("Name, email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }

      setOtp("");
      setShowOtpStep(true);
      if (!resend) {
        toast.success(data.message || "OTP sent successfully");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      toast.success("Account created successfully");
      navigate({ to: "/login" });
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };
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
            {!showOtpStep && mode === "signup" && (
              <Field
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            {!showOtpStep && (
              <Field
                label="Email"
                type="email"
                placeholder="you@reelo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {!showOtpStep && (
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {mode === "signup" && showOtpStep ? (
              <>
                <Field
                  label="OTP"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)]"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpStep(false)}
                    disabled={loading}
                    className="px-4 py-3 rounded-full glass border border-white/10 hover:border-primary/40 transition text-sm font-medium"
                  >
                    Back
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendOtp(true)}
                  disabled={loading}
                  className="w-full py-3 rounded-full glass border border-white/10 hover:border-primary/40 transition text-sm font-medium"
                >
                  {loading ? "Sending..." : "Resend OTP"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={mode === "signup" ? () => handleSendOtp() : handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)]"
              >
                {loading ? (mode === "signup" ? "Sending OTP..." : "Signing in...") : mode === "signup" ? "Send OTP" : "Sign in"}
              </button>
            )}
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
