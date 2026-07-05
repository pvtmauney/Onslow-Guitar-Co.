import type { LuthierMedia } from "@/lib/types";
import { storageUrl } from "@/lib/data";

export function VideoEmbed({
  media,
  ownerName,
}: {
  media: LuthierMedia;
  ownerName: string;
}) {
  if (media.kind === "youtube" && media.external_id) {
    return (
      <div className="vid">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.external_id)}`}
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
          title={media.alt_text || `${ownerName} — video`}
          loading="lazy"
        />
      </div>
    );
  }
  if (media.kind === "vimeo" && media.external_id) {
    return (
      <div className="vid">
        <iframe
          src={`https://player.vimeo.com/video/${encodeURIComponent(media.external_id)}`}
          allowFullScreen
          title={media.alt_text || `${ownerName} — video`}
          loading="lazy"
        />
      </div>
    );
  }
  if (media.kind === "video_file" && media.storage_path) {
    return (
      <div className="vid">
        <video
          controls
          preload="metadata"
          src={storageUrl(media.storage_path)}
          aria-label={media.alt_text || `${ownerName} — video`}
        />
      </div>
    );
  }
  return null;
}
