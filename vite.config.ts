import { defineConfig } from "@Lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { reelImportDevPlugin } from "./vite/reel-import-dev-plugin";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
      }),
      reelImportDevPlugin(),
    ],
  },
});
