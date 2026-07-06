import Link from "next/link";
import { SITE } from "@/lib/types";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <p className="mark">{SITE.name}</p>
          <p style={{ marginTop: 6 }}>
            HANDBUILT INSTRUMENTS · JACKSONVILLE, NC
          </p>
        </div>
        <p>© {new Date().getFullYear()} ONSLOW GUITAR CO.</p>
        <a className="owner-link" href="mailto:pvtmauney@gmail.com">
          Site by Brice Mauney
        </a>
        <Link className="owner-link" href="/admin">
          Owner sign-in
        </Link>
      </div>
    </footer>
  );
}
