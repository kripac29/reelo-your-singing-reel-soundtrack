import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ReelCover } from "@/components/ReelCover";

export function PlaylistCard({
  id,
  title,
  desc,
  cover,
  count,
  thumbnails,
}: {
  id: string;
  title: string;
  desc: string;
  cover: string;
  count: number;
  thumbnails?: string[];
}) {
  const hasCollage = thumbnails?.length && thumbnails.length > 1;

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Link to="/app/playlist/$id" params={{ id }} className="block glass rounded-2xl p-4 group">
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-950/50">
          {hasCollage ? (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-1 p-1">
              {thumbnails!.slice(0, 4).map((src, index) => (
                <ReelCover key={index} src={src} alt={`${title} thumbnail ${index + 1}`} className="rounded-2xl" fallbackLabel="Reel" />
              ))}
            </div>
          ) : (
            <ReelCover src={cover} alt={title} className="h-full w-full" fallbackLabel="Reel cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-90 transition" />
          <div className="absolute bottom-3 right-3 w-11 h-11 rounded-full gradient-brand grid place-items-center text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition shadow-[0_10px_30px_oklch(0.72_0.3_350/0.6)]">
            <Play className="w-4 h-4 ml-0.5" />
          </div>
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] bg-black/40 backdrop-blur border border-white/10">{count} reels</div>
        </div>
        <div className="font-display font-semibold truncate group-hover:text-primary transition">{title}</div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">{desc}</div>
      </Link>
    </motion.div>
  );
}
