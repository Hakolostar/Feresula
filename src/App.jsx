import {useEffect, useState} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Coffee,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Wifi,
  X
} from "lucide-react";

const categories = [
  {id:"all", label:"All the good things"},
  {id:"coffee", label:"Coffee & drinks"},
  {id:"bakery", label:"Bakery & pastries"},
  {id:"savory", label:"Savory bites"}
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});

    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Brand({footer = false}) {
  return (
    <a className={`brand${footer ? " brand-footer" : ""}`} href="#home" aria-label="Feresula Coffee home">
      <span className="brand-mark" aria-hidden="true">ፈ</span>
      <span className="brand-title">FERESULA<span className="brand-sub">COFFEE · ፈረሱላ ቡና</span></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(value => !value)}
        >
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
        <nav className={`nav${open ? " nav-open" : ""}`} id="main-nav" aria-label="Main navigation">
          <a href="#story" onClick={closeMenu}>Our story</a>
          <a href="#menu" onClick={closeMenu}>The menu</a>
          <a href="#space" onClick={closeMenu}>The space</a>
          <a href="#locations" onClick={closeMenu}>Locations</a>
          <a href="#visit" onClick={closeMenu}>Find us</a>
        </nav>
        <a className="header-cta" href="#visit">Come say hello <ArrowUpRight size={14} /></a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/hero-coffee.jpg" aria-label="Coffee being prepared">
        <source src="/coffee-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-content">
        <div className="eyebrow">Good coffee, close to home</div>
        <h1>Savor the<br />Perfect Brew!</h1>
        <p className="hero-copy">Rooted in Ethiopia’s coffee culture and made for the rhythm of Saris. Indulge in the rich aroma and bold flavor of our freshly brewed coffee.</p>
        <div className="hero-actions">
          <a className="button button-gold" href="#menu">Explore the menu <ArrowDown size={14} /></a>
          <a className="text-link" href="#locations">Visit us in Addis <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="hero-note"><b>01 / 04</b> Brewed with a sense of place</div>
    </section>
  );
}

function IntroStrip() {
  return (
    <div className="intro-strip">
      <div className="wrap strip-inner">
        <div className="strip-item"><Coffee className="strip-icon" /><span><strong>Ethiopian coffee, every day</strong><small>Freshly brewed, the way we love it</small></span></div>
        <div className="strip-item"><MapPin className="strip-icon" /><span><strong>Three Addis branches</strong><small>Bole · Saris · Ministry of Mines</small></span></div>
        <div className="strip-item"><Clock3 className="strip-icon" /><span><strong>Here all week</strong><small>Find the hours for your branch</small></span></div>
        <div className="strip-item"><Wifi className="strip-icon" /><span><strong>Make yourself at home</strong><small>Good seats, good company, Wi-Fi</small></span></div>
      </div>
    </div>
  );
}

function Story() {
  return (
    <section className="section story-section" id="story">
      <div className="wrap story">
        <div className="story-copy reveal">
          <div className="section-label">A name with roots</div>
          <h2>Old roots.<br />Fresh perspective.</h2>
          <p className="section-copy">Feresula nods to the stories and traditions woven through Ethiopia’s coffee trade—then brings that spirit into the everyday life of Addis. A familiar cup, a fresh bake, a warm welcome: simple things, made with care.</p>
          <p className="section-copy">Our doors are open for your first coffee of the day, a catch-up with friends, or a quiet afternoon with your laptop. There’s always room at the table.</p>
          <a className="story-link" href="#locations">Get to know your neighborhood café <span aria-hidden="true">→</span></a>
        </div>
        <div className="story-visual reveal">
          <img className="story-img" src="/feature-latte.jpg" alt="Freshly made latte at Feresula Coffee" />
          <div className="story-stamp">Coffee<br />brings us<br />together</div>
          <div className="image-caption"><strong>Your Addis coffee stop</strong><span>Easy mornings, one cup at a time</span></div>
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then(response => {
        if (!response.ok) throw new Error("Menu could not be loaded.");
        return response.json();
      })
      .then(data => setMenuItems(data.items))
      .catch(() => setError("Our menu is being refreshed. Please visit us to see today’s selection."));
  }, []);

  const visibleItems = category === "all" ? menuItems.slice(0, 8) : menuItems.filter(item => item.category === category);

  return (
    <section className="section menu-section" id="menu">
      <div className="wrap">
        <div className="menu-heading reveal">
          <div><div className="section-label">From our counter</div><h2>Find your new<br />usual.</h2></div>
          <p className="section-copy">Slow down over a proper coffee, pick up a pastry, or make a meal of it. There’s something for every kind of day.</p>
        </div>
        <div className="menu-tabs" role="tablist" aria-label="Menu categories">
          {categories.map(item => (
            <button
              className="menu-tab"
              type="button"
              role="tab"
              aria-selected={category === item.id}
              key={item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {error ? <p className="menu-error" role="status">{error}</p> : (
          <div className="menu-grid" aria-live="polite">
            {visibleItems.map(item => (
              <article className="menu-card" key={item.name}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="menu-card-content">
                  <div className="menu-card-top"><h3>{item.name}</h3><span className="price">{item.price}</span></div>
                  <p>{item.description}</p>
                  <span className="category-label">{item.label}</span>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="menu-footnote">Prices are estimates in ETB; selection and pricing may vary. Ask us about today’s counter specials.</p>
      </div>
    </section>
  );
}

function SpacePromo() {
  return (
    <section className="space-band" id="space">
      <div className="space-content reveal">
        <div className="eyebrow">A little something special</div>
        <h2>Morning Happy Hours</h2>
        <p className="section-copy">Start your day with a smile! Enjoy special moments over your favorite coffee from morning until evening at Feresula.</p>
        <div className="space-points"><span>8 AM – 6 PM</span><span>Every day in Addis</span></div>
        <a className="space-link" href="#locations">Find your branch <ArrowUpRight size={14} /></a>
      </div>
    </section>
  );
}

function LocationCard({branch}) {
  return (
    <article className="location-card">
      <img className="location-photo" src={branch.photo} alt={`${branch.slot} of Feresula Coffee in Addis Ababa`} loading="lazy" />
      <div className="location-card-body">
        <h3>{branch.name}</h3>
        <p className="location-subtitle">{branch.subtitle}</p>
        <p className="location-vibe">{branch.vibe}</p>
        <div className="location-tags" aria-label={`${branch.name} branch features`}>
          {branch.tags.map(tag => <span className="location-tag" key={tag}>{tag}</span>)}
        </div>
        <div className="location-meta">
          <p className="location-meta-row"><Clock3 /><span>{branch.hours}</span></p>
          {branch.phoneHref && branch.phoneLabel && (
            <a className="location-meta-row" href={branch.phoneHref}><Phone /><span>{branch.phoneLabel}</span></a>
          )}
          <p className="location-meta-row"><MapPin /><span>{branch.locationNote}</span></p>
        </div>
        <a className="directions-link" href={branch.maps} target="_blank" rel="noopener noreferrer">
          Get directions <ArrowUpRight size={15} />
        </a>
        <p className="maps-caption">Opens Google Maps</p>
      </div>
    </article>
  );
}

function Locations() {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/locations")
      .then(response => {
        if (!response.ok) throw new Error("Locations could not be loaded.");
        return response.json();
      })
      .then(data => setBranches(data.items))
      .catch(() => setError("Branch details are temporarily unavailable. Please call us for help."));
  }, []);

  return (
    <section className="section locations-section" id="locations">
      <div className="wrap">
        <div className="locations-heading reveal">
          <div className="section-label">Three branches</div>
          <h2>Find us across <em>Addis Ababa</em>.</h2>
          <p className="section-copy">Each room has its own light and its own rhythm — same coffee, same kitchen, same welcome.</p>
        </div>
        {error ? <p className="location-error" role="status">{error}</p> : (
          <div className="location-grid">
            {branches.map(branch => <LocationCard branch={branch} key={branch.name} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function VisitSection() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitInquiry(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    setStatus("Sending your note…");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/inquiry", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t send your note. Please try again.");
      form.reset();
      setStatus("Thanks! Your note is with us. We’ll be in touch by phone.");
    } catch (requestError) {
      setError(true);
      setStatus(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section visit-section" id="visit">
      <div className="wrap visit">
        <div className="visit-copy reveal">
          <div className="section-label">Come find us</div>
          <h2>Your table<br />in Addis.</h2>
          <p className="section-copy">Choose your neighborhood, then drop by for coffee, a fresh bake, or a slow afternoon with us.</p>
          <div className="visit-details">
            <p><MapPin /><span>Bole · Saris · Ministry of Mines<br />Addis Ababa, Ethiopia</span></p>
            <p><Clock3 /><span>Opening hours vary by branch<br />See each location for details</span></p>
            <a href="tel:+251966411151"><Phone /><span>Call Saris · +251 96 641 1151</span></a>
          </div>
        </div>
        <form className="inquiry reveal" onSubmit={submitInquiry}>
          <h3>Save a little note</h3>
          <p>Planning a visit or have a question? Leave us a note and we’ll be in touch by phone.</p>
          <div className="form-grid">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" maxLength="80" required /></div>
            <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength="24" placeholder="+251 ..." required /></div>
            <div className="field"><label htmlFor="date">Visit date</label><input id="date" name="date" type="date" /></div>
            <div className="field"><label htmlFor="guests">Number of guests</label>
              <select id="guests" name="guests" defaultValue="1">
                <option value="1">Just me</option><option value="2">2 people</option><option value="3">3 people</option><option value="4">4 people</option><option value="5">5 people</option><option value="6">6 people</option>
              </select>
            </div>
            <div className="field field-wide"><label htmlFor="note">Your note</label><textarea id="note" name="note" maxLength="500" placeholder="A question, a request, or just say hello…" /></div>
          </div>
          <div className="form-bottom">
            <button className="button" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send your note"} <ArrowUpRight size={14} /></button>
            <p className={`form-status${error ? " error" : ""}`} role="status" aria-live="polite">{status}</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand"><Brand footer /><p>A little more Addis in every cup.</p></div>
          <div className="footer-links">
            <div className="footer-col"><strong>Explore</strong><a href="#story">Our story</a><a href="#menu">The menu</a><a href="#space">The space</a><a href="#locations">Locations</a></div>
            <div className="footer-col"><strong>Find us</strong><a href="#locations">Bole · Saris · Ministry of Mines</a><a href="#locations">Hours and directions</a><a href="tel:+251966411151">Saris · +251 96 641 1151</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Feresula Coffee · ፈረሱላ ቡና</span><span>Made for Addis Ababa.</span></div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <IntroStrip />
        <Story />
        <MenuSection />
        <SpacePromo />
        <Locations />
        <VisitSection />
      </main>
      <Footer />
    </>
  );
}
