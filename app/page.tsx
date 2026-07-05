import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StringsDivider } from "@/components/StringsDivider";
import { BuilderCard } from "@/components/BuilderCard";
import { GearSection } from "@/components/GearSection";
import { ProductCard } from "@/components/ProductCard";
import { getLuthiers, getProducts } from "@/lib/data";
import { AMP_CATEGORIES, SITE } from "@/lib/types";

// Re-generate at most every 5 minutes; admin saves also revalidate on demand.
export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onslowguitar.co";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicStore",
  name: SITE.name,
  description:
    "Boutique guitar store carrying instruments handbuilt by local luthiers in Onslow County and surrounding counties in eastern North Carolina.",
  url: siteUrl,
  telephone: SITE.phoneHref,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    postalCode: SITE.address.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
};

export default async function HomePage() {
  const [luthiers, products] = await Promise.all([
    getLuthiers(),
    getProducts(),
  ]);
  const merch = products.filter((p) => p.category === "Merch");
  const ampsAndCabs = products.filter((p) =>
    AMP_CATEGORIES.includes(p.category)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="top">
        <section className="hero">
          <div className="wrap">
            <p className="kicker">Boutique · Handbuilt · Local</p>
            <h1>
              Guitars built by <em>local hands,</em> sold by people who know
              the builder.
            </h1>
            <p className="lede">
              Onslow Guitar Co. is a small storefront in Jacksonville, North
              Carolina with one rule: we only carry instruments made by
              luthiers working in Onslow County and the surrounding area. No
              warehouse stock. No two alike.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="#builders">
                Meet our builders
              </a>
              <a className="btn btn-ghost" href="#join">
                Are you a luthier?
              </a>
            </div>
          </div>
        </section>

        <StringsDivider />

        <section id="builders" className="builders-section">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Our Builders</p>
              <h2>The luthiers on our wall</h2>
              <p>
                Every builder we carry works within driving distance of the
                shop, and we&apos;ve stood in every workshop we buy from. The
                roster is small on purpose — and growing.
              </p>
            </div>
            <div className="builder-list">
              {luthiers.length === 0 ? (
                <div className="empty-note">BUILDER PROFILES COMING SOON</div>
              ) : (
                luthiers.map((l, i) => (
                  <BuilderCard key={l.id} luthier={l} priority={i === 0} />
                ))
              )}
            </div>
          </div>
        </section>

        <section id="amps" className="shop-section">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Amps &amp; Cabs</p>
              <h2>Hand-wired amps. Homemade cabinets.</h2>
              <p>
                Point-to-point tube amps and speaker cabinets built the same
                way the guitars on our wall are — by local hands, one at a
                time. Plug into any of them and hear what a soldering iron
                and real wood do for your tone.
              </p>
            </div>
            <div className="shop-grid">
              {ampsAndCabs.length === 0 ? (
                <div className="empty-note">AMPS &amp; CABS COMING SOON</div>
              ) : (
                ampsAndCabs.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>

        <section id="shop" className="shop-section">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Gear</p>
              <h2>Everything else you leave with</h2>
              <p>
                Strings and cables to keep you playing, straps and
                accessories for the road. Everything below is in the store;
                call to hold an item.
              </p>
            </div>
            <GearSection products={products} />
          </div>
        </section>

        <section
          id="merch"
          style={{
            background: "#fff",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Merch</p>
              <h2>Wear the shop. Sticker the case.</h2>
              <p>
                Hats, tees, shop shirts, mugs, koozies, stickers, magnets, and
                decals — take a little of Onslow Guitar Co. home even if the
                guitar has to wait.
              </p>
            </div>
            <div className="shop-grid">
              {merch.length === 0 ? (
                <div className="empty-note">MERCH COMING SOON</div>
              ) : (
                merch.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>

        <section className="callout" id="join">
          <div className="wrap">
            <div>
              <p className="kicker">For Luthiers</p>
              <h2>
                Building in eastern North Carolina? We want your instruments
                on our wall.
              </h2>
              <ul>
                <li>
                  Consignment or outright purchase — we&apos;re flexible while
                  we grow together.
                </li>
                <li>
                  Your instruments displayed, humidified, and demoed properly,
                  with your name on the card.
                </li>
                <li>A profile on this site with your photos, videos, and story.</li>
                <li>We handle the retail side so you can stay at the bench.</li>
              </ul>
            </div>
            <div className="callout-card">
              <h3>Introduce yourself</h3>
              <p>
                Send a few photos of your recent work and a little about how
                you build. New and up-and-coming builders are welcome —
                that&apos;s the point.
              </p>
              <p className="contact">
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <br />
                <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
              </p>
            </div>
          </div>
        </section>

        <section className="visit" id="visit">
          <div className="wrap">
            <div>
              <div className="sec-head" style={{ marginBottom: 22 }}>
                <p className="kicker">Visit</p>
                <h2>The shop is quiet on purpose.</h2>
              </div>
              <p style={{ color: "var(--color-ink-dim)", maxWidth: "50ch" }}>
                No sales floor buzz, no roped-off wall. Take an instrument
                down, find a stool, and play as long as you like. If you want
                a private hour with a few guitars, call ahead and we&apos;ll
                pull them for you.
              </p>
              <div className="hero-actions" style={{ marginTop: 28 }}>
                <a className="btn btn-amber" href={`tel:${SITE.phoneHref}`}>
                  Call the shop — {SITE.phone}
                </a>
              </div>
            </div>
            <div className="visit-card">
              <h3>{SITE.name}</h3>
              <dl className="hours">
                {SITE.hours.map((h) => (
                  <div key={h.days} style={{ display: "contents" }}>
                    <dt>{h.days}</dt>
                    <dd>{h.open}</dd>
                  </div>
                ))}
              </dl>
              <p className="addr">
                <strong>{SITE.address.street}</strong>
                <br />
                {SITE.address.city}, North Carolina {SITE.address.zip}
                <br />
                <a href={`mailto:${SITE.email}`} style={{ textDecoration: "none" }}>
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
