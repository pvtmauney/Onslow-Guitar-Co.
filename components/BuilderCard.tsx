import type { LuthierWithMedia } from "@/lib/types";
import { storageUrl } from "@/lib/data";
import { GuitarEmblem } from "./GuitarEmblem";
import { VideoEmbed } from "./VideoEmbed";
import { ZoomImage } from "./ZoomImage";

export function BuilderCard({
  luthier,
  priority = false,
}: {
  luthier: LuthierWithMedia;
  priority?: boolean;
}) {
  const media = [...(luthier.media ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const photos = media.filter((m) => m.kind === "photo" && m.storage_path);
  const videos = media.filter((m) => m.kind !== "photo");
  const [portrait, ...gallery] = photos;

  return (
    <article className="builder">
      <div className="builder-top">
        <div className="builder-photo">
          {portrait ? (
            <ZoomImage
              src={storageUrl(portrait.storage_path!)}
              alt={portrait.alt_text || `${luthier.name} — portrait`}
              className="zoom-fill"
              sizes="(max-width: 820px) 100vw, 340px"
              priority={priority}
            />
          ) : (
            <div className="placeholder">
              <GuitarEmblem />
              <span>PHOTOS COMING SOON</span>
            </div>
          )}
        </div>
        <div className="builder-info">
          <p className="county">
            {luthier.county}
            {luthier.badge ? `   ·   ${luthier.badge}` : ""}
          </p>
          <h3>{luthier.name}</h3>
          <p className="town">{luthier.town}</p>
          <p className="bio">{luthier.bio}</p>
          {luthier.specialties.length > 0 && (
            <div className="builds">
              {luthier.specialties.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(gallery.length > 0 || videos.length > 0) && (
        <div className="media-row">
          <p className="media-label">From the workshop</p>
          {gallery.length > 0 && (
            <div className="gallery">
              {gallery.map((m) => (
                <ZoomImage
                  key={m.id}
                  src={storageUrl(m.storage_path!)}
                  alt={m.alt_text || `${luthier.name} — instrument photo`}
                  className="gallery-thumb"
                  sizes="147px"
                />
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className="video-grid">
              {videos.map((m) => (
                <VideoEmbed key={m.id} media={m} ownerName={luthier.name} />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
