import {
  createFileRoute,
  Link,
  Navigate,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/reelo-logo.png";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getCurrentUser, useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (typeof window !== "undefined" && (await getCurrentUser())) {
      throw redirect({ to: "/app" });
    }
  },
  component: Login,
});

function Login() {
  return <AuthCard mode="login" />;
}

type ForgotStep = "email" | "otp" | "password";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup OTP
  const [otp, setOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);

  // Forgot password
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [resetOtp, setResetOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn, user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) return null;
  if (user) return <Navigate to="/app" />;

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      await signIn(email.trim(), password);

      navigate({ to: "/app" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIGNUP OTP
  // =========================

  const handleSendOtp = async (resend = false) => {
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Name, email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }

      setOtp("");
      setShowOtpStep(true);

      toast.success(
        resend
          ? "OTP sent again"
          : data.message || "OTP sent successfully",
      );
    } catch {
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            otp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "OTP verification failed");
        return;
      }

      toast.success("Account created successfully. Please sign in.");

      navigate({ to: "/login" });
    } catch {
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // STEP 1: SEND RESET OTP
  // =========================

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Unable to send verification code",
        );
        return;
      }

      setResetOtp("");
      setForgotStep("otp");

      toast.success(
        data.message || "Verification code sent",
      );
    } catch {
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // STEP 2: VERIFY RESET OTP
  // =========================

  const handleVerifyResetOtp = async () => {
    if (resetOtp.length !== 6) {
      toast.error("Enter the 6-digit verification code");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: resetOtp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid or expired code");
        return;
      }

      if (!data.resetToken) {
        toast.error("Reset authorization was not returned");
        return;
      }

      setResetToken(data.resetToken);
      setForgotStep("password");

      toast.success("Code verified");
    } catch {
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // STEP 3: RESET PASSWORD
  // =========================

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Enter and confirm your new password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!resetToken) {
      toast.error("Reset authorization is missing. Verify your OTP again.");
      setForgotStep("otp");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            resetToken,
            newPassword,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to reset password");
        return;
      }

      toast.success("Password updated successfully");

      // Return to normal login.
      setForgotPassword(false);
      setForgotStep("email");
      setResetOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setPassword("");
    } catch {
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const exitForgotPassword = () => {
    setForgotPassword(false);
    setForgotStep("email");
    setResetOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // =========================
  // FORGOT PASSWORD SCREEN
  // =========================

  if (mode === "login" && forgotPassword) {
    return (
      <AuthLayout>
        <h1 className="font-display text-3xl font-bold">
          Reset your password
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          {forgotStep === "email" &&
            "Enter the email connected to your Reelo account."}

          {forgotStep === "otp" &&
            `We sent a verification code to ${email}.`}

          {forgotStep === "password" &&
            "Choose a new password for your account."}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {forgotStep === "email" && (
            <>
              <Field
                label="Email"
                type="email"
                placeholder="you@reelo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)] disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send verification code"}
              </button>
            </>
          )}

          {forgotStep === "otp" && (
            <>
              <Field
                label="Verification code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={resetOtp}
                onChange={(e) =>
                  setResetOtp(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
              />

              <button
                type="button"
                onClick={handleVerifyResetOtp}
                disabled={loading || resetOtp.length !== 6}
                className="w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)] disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full py-3 rounded-full glass border border-white/10 hover:border-primary/40 transition text-sm font-medium"
              >
                Resend code
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetOtp("");
                  setForgotStep("email");
                }}
                disabled={loading}
                className="w-full text-sm text-muted-foreground hover:text-primary transition"
              >
                Change email
              </button>
            </>
          )}

          {forgotStep === "password" && (
            <>
              <Field
                label="New password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Field
                label="Confirm new password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)] disabled:opacity-60"
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </>
          )}
        </form>

        <button
          type="button"
          onClick={exitForgotPassword}
          disabled={loading}
          className="mt-6 w-full text-center text-sm text-primary hover:underline"
        >
          ← Back to login
        </button>
      </AuthLayout>
    );
  }

  // =========================
  // NORMAL LOGIN / SIGNUP
  // =========================

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl font-bold">
        {mode === "login"
          ? "Welcome back"
          : "Create your account"}
      </h1>

      <p className="text-sm text-muted-foreground mt-1">
        {mode === "login"
          ? "Your library is waiting."
          : "Create your personal Reelo library."}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
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
          <>
            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "login" && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPassword(true);
                    setForgotStep("email");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </>
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
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="flex-1 py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)] disabled:opacity-60"
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
            onClick={
              mode === "signup"
                ? () => handleSendOtp()
                : handleLogin
            }
            disabled={loading}
            className="w-full py-3 rounded-full gradient-brand text-white font-semibold mt-2 shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)] disabled:opacity-60"
          >
            {loading
              ? mode === "signup"
                ? "Sending OTP..."
                : "Signing in..."
              : mode === "signup"
                ? "Send OTP"
                : "Sign in"}
          </button>
        )}
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            New to Reelo?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

// =========================
// SHARED AUTH LAYOUT
// =========================

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.72_0.3_350/0.4),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.45_0.22_270/0.5),transparent_60%)]" />

        <div className="relative text-center space-y-6">
          <img
            src={logo}
            alt=""
            className="w-32 h-32 mx-auto rounded-3xl float-slow glow"
          />

          <h2 className="font-display text-4xl font-bold">
            Press play on{" "}
            <span className="text-gradient">your reels.</span>
          </h2>

          <p className="text-muted-foreground max-w-sm mx-auto">
            A calmer, more personal way to listen to the singing reels
            you already love.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md glass-strong rounded-3xl p-8">
          <Link
            to="/"
            className="flex items-center gap-2 mb-6 lg:hidden"
          >
            <img
              src={logo}
              alt=""
              className="w-8 h-8 rounded"
            />

            <span className="font-display font-bold text-gradient">
              Reelo
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      <input
        {...props}
        className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/60 focus:bg-white/10 transition"
      />
    </label>
  );
}