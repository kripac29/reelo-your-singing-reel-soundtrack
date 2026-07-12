import { cn } from "@/lib/utils";
import { ReelCover } from "@/components/ReelCover";

export function PlaylistThumbnail({
  cover,
  thumbnails,
  className,
}: {
  cover?: string;
  thumbnails?: string[];
  className?: string;
}) {
  const hasCollage = thumbnails?.length && thumbnails.length > 1;

  return (
    <div className={cn("relative overflow-hidden bg-slate-950/50", className)}>
      {hasCollage ? (
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
          {thumbnails!.slice(0, 4).map((src, index) => (
            <ReelCover
              key={index}
              src={src}
              alt={`Playlist thumbnail ${index + 1}`}
              className="rounded-2xl"
              fallbackLabel="Reel"
            />
          ))}
        </div>
      ) : (
        <ReelCover src={cover} alt="Playlist cover" className="h-full w-full" fallbackLabel="Playlist cover" />
      )}
    </div>
  );
}
