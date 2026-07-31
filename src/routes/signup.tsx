import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCard } from "./login";
import { getCurrentUser } from "@/lib/auth-store";

export const Route = createFileRoute("/signup")({
  beforeLoad: async () => {
    if (typeof window !== "undefined" && (await getCurrentUser())) throw redirect({ to: "/app" });
  },
  component: () => <AuthCard mode="signup" />,
});
