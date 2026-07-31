import { defineConfig, type PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { reelImportDevPlugin } from "./vite/reel-import-dev-plugin";

export default defineConfig(async ({ command }) => {
  const buildOnlyPlugins: PluginOption[] = [];

  if (command === "build") {
    try {
      const { cloudflare } = await import("@cloudflare/vite-plugin");
      buildOnlyPlugins.push(cloudflare({ viteEnvironment: { name: "ssr" } }));
    } catch {
      // Cloudflare plugin is optional (e.g. on Vercel) — Nitro handles the build.
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...buildOnlyPlugins,
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      viteReact(),
      nitro({
        preset: "vercel",
      }),
      reelImportDevPlugin(),
    ],
  };
});
