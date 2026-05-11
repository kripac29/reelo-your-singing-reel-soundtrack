import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "./login";

export const Route = createFileRoute("/signup")({ component: () => <AuthCard mode="signup" /> });
