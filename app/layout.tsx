import type { Metadata } from "next";
import { Fraunces, Karla, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://onslowguitar.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Onslow Guitar Co. — Handbuilt Guitars in Jacksonville, NC",
    template: "%s · Onslow Guitar Co.",
  },
  description:
    "A boutique guitar store in Jacksonville, North Carolina carrying instruments handbuilt by luthiers in Onslow County and the surrounding area. No warehouse stock. No two alike.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Onslow Guitar Co.",
    title: "Onslow Guitar Co. — Handbuilt Guitars in Jacksonville, NC",
    description:
      "Boutique guitar store carrying instruments handbuilt by local luthiers in Onslow County, North Carolina.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onslow Guitar Co. — Handbuilt Guitars in Jacksonville, NC",
    description:
      "Boutique guitar store carrying instruments handbuilt by local luthiers in Onslow County, North Carolina.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${karla.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
