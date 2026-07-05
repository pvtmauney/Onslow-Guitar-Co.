"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * An image that opens a full-screen lightbox when clicked.
 * Renders a positioned <button> containing a fill-mode next/image,
 * so the wrapping element must establish the box (aspect ratio / size).
 */
export function ZoomImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        aria-label={`View larger photo: ${alt}`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </button>
      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} />
          <button
            type="button"
            className="sr-only"
            onClick={close}
            autoFocus
          >
            Close enlarged photo
          </button>
        </div>
      )}
    </>
  );
}
