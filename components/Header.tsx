export function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="Onslow Guitar Co. home">
          <span className="mark">Onslow Guitar Co.</span>
          <span className="est">JACKSONVILLE · NC</span>
        </a>
        <ul className="nav-links">
          <li><a href="#builders">Our Builders</a></li>
          <li><a href="#shop">Gear</a></li>
          <li><a href="#merch">Merch</a></li>
          <li><a href="#join">For Luthiers</a></li>
          <li><a href="#visit">Visit</a></li>
        </ul>
        <a className="nav-cta" href="#visit">VISIT THE SHOP →</a>
      </div>
    </header>
  );
}
