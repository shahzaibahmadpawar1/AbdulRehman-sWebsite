import { useEffect, useMemo, useRef, useState } from "react";
import { getProducts } from "./api/productsApi";
import { categories, heroChoicesDefault, spareParts } from "./data/storefrontData";

const storyPanels = [
  {
    title: "From beginner flights to pro shoots in one ecosystem",
    copy: "Start with Mini series and scale into Air/Mavic workflows without changing your support channel.",
    step: "Step 01"
  },
  {
    title: "Fast spare parts availability keeps your drone in the air",
    copy: "Propellers, batteries, controllers, and filter kits are available with quick confirmation on WhatsApp.",
    step: "Step 02"
  },
  {
    title: "Diagnosis and repairs with clear service workflow",
    copy: "Crash to calibration, our workshop team handles inspection, quotation, repair, and final flight checks.",
    step: "Step 03"
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [liveCount, setLiveCount] = useState(27);
  const [storyActiveIndex, setStoryActiveIndex] = useState(0);
  const [cartToast, setCartToast] = useState(false);
  const [cartToastText, setCartToastText] = useState("Added to cart");
  const storySectionRef = useRef(null);

  const heroChoices = useMemo(() => {
    const source = products.length > 0 ? products : heroChoicesDefault;
    return source.slice(0, 5).map((product) => ({
      name: product.name,
      meta: product.meta || `${product.tags?.[0] || "Premium build"} • ${product.tags?.[1] || "Creator ready"} • ${product.price}`,
      image: product.image
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((product) => product.tag === filter);
  }, [filter]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0), [cart]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const data = await getProducts();
        if (ignore) return;
        setProducts(data);
      } catch (error) {
        if (!ignore) {
          setProducts([]);
          console.error(error);
        }
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.max(heroChoices.length, 1));
    }, 3800);

    return () => clearInterval(timer);
  }, [heroChoices.length]);

  useEffect(() => {
    let ignore = false;
    const animate = () => {
      const items = document.querySelectorAll("[data-count]");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const span = entry.target;
          const target = Number(span.dataset.count || "0");
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 45));
          const tick = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(tick);
            }
            span.textContent = current.toLocaleString("en-PK");
          }, 26);
          observer.unobserve(span);
        });
      }, { threshold: 0.6 });

      items.forEach((item) => observer.observe(item));
      return observer;
    };

    if (!ignore) {
      animate();
    }
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("anim-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    document.querySelectorAll("[data-anim]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".reveal").forEach((element) => {
      if (!element.classList.contains("in-view")) {
        revealObserver.observe(element);
      }
    });

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const bar = document.getElementById("scrollProgress");
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const updateStory = () => {
      const section = storySectionRef.current;
      if (!section) return;
      if (window.innerWidth <= 900) {
        setStoryActiveIndex(0);
        return;
      }
      const total = section.offsetHeight - window.innerHeight;
      const offset = Math.min(Math.max(window.scrollY - (section.offsetTop - 90), 0), total);
      const progress = total > 0 ? offset / total : 0;
      const index = Math.min(storyPanels.length - 1, Math.floor(progress * storyPanels.length));
      setStoryActiveIndex(index);
    };

    updateStory();
    window.addEventListener("scroll", updateStory, { passive: true });
    window.addEventListener("resize", updateStory);
    return () => {
      window.removeEventListener("scroll", updateStory);
      window.removeEventListener("resize", updateStory);
    };
  }, []);

  useEffect(() => {
    const updateNav = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      if (window.scrollY > 60) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    };

    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCount((current) => {
        let next = current + Math.floor(Math.random() * 7) - 3;
        if (next < 18) next = 18;
        if (next > 64) next = 64;
        return next;
      });
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateGlow = (event) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", updateGlow, { passive: true });
    return () => window.removeEventListener("mousemove", updateGlow);
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll(".btn-dark, .btn-outline, .add-btn, .service-btn");
    const cleanup = [];

    buttons.forEach((button) => {
      const onMove = (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      };
      const onLeave = () => {
        button.style.transform = "";
        button.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)";
        window.setTimeout(() => {
          button.style.transition = "";
        }, 400);
      };

      button.addEventListener("mousemove", onMove);
      button.addEventListener("mouseleave", onLeave);
      cleanup.push(() => {
        button.removeEventListener("mousemove", onMove);
        button.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, [filter, isCartOpen, quickView]);

  useEffect(() => {
    document.querySelectorAll(".trust-item").forEach((item, index) => {
      item.style.setProperty("--trust-i", index);
    });
  }, []);

  function addToCart(product) {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      if (existing) {
        return previous.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...previous, { ...product, qty: 1 }];
    });
    setCartToastText(`${product.name} added to cart`);
    setCartToast(true);
    window.setTimeout(() => setCartToast(false), 2500);
  }

  function removeFromCart(id) {
    setCart((previous) => previous.filter((item) => item.id !== id));
  }

  const activeHero = heroChoices[heroIndex] || heroChoicesDefault[0];

  return (
    <>
      <div className="scroll-progress" id="scrollProgress" />

      <main className="main-content">
        <div className="topbar">
          <a href="https://maps.app.goo.gl/uqD86A9YLCnu2sBM6" target="_blank" rel="noreferrer">
            📍 Shop #9, Hall Road, Lahore — Open Sunday 24hrs
          </a>
          <div className="topbar-right">
            <a href="tel:+923009400956">📞 0300-9400956</a>
            <a href="https://wa.me/923009400956" target="_blank" rel="noreferrer">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <nav className="navbar">
          <a href="#" className="logo">Amir Electronics</a>
          <ul className="nav-links">
            <li><a href="#drones">Drones</a></li>
            <li><a href="#location">Visit Us</a></li>
            <li><a href="tel:+923009400956">Contact</a></li>
          </ul>
          <button className="nav-cart" onClick={() => setIsCartOpen(true)}>
            🛒 Cart <span className="cart-badge">{totalItems}</span>
          </button>
        </nav>

        <section className="hero" data-anim="fade-down">
          <div className="hero-left">
            <div className="hero-tag">Official DJI Store · Lahore</div>
            <h1>Drones for<br />Every Budget</h1>
            <p className="hero-sub">Whether you&apos;re flying for the first time or shooting professional footage — we have the right drone for you. Free delivery across Pakistan.</p>
            <div className="hero-actions">
              <a href="#drones" className="btn-dark">Browse Drones</a>
              <a href="#location" className="btn-outline">Visit Our Shop</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-drone-wrap">
              <div className="hero-spotlight reveal" id="heroSpotlight">
                <div className="hero-live">Live demand</div>
                <img id="heroFeatureImage" className="hero-spotlight-img" src={activeHero.image} alt="Featured drone" loading="eager" />
                <div className="hero-spotlight-body">
                  <div className="hero-kicker">Featured Right Now</div>
                  <div className="hero-name" id="heroFeatureName">{activeHero.name}</div>
                  <div className="hero-meta" id="heroFeatureMeta">{activeHero.meta}</div>
                  <div className="hero-dots" id="heroDots">
                    {heroChoices.map((choice, index) => (
                      <button
                        key={choice.name}
                        className={`hero-dot ${index === heroIndex ? "active" : ""}`}
                        onClick={() => setHeroIndex(index)}
                        aria-label={`Show featured drone ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="trust-bar">
          <div className="trust-item" data-anim="fade-up" data-delay="100"><span className="trust-icon">🚚</span> <span data-count="4200">0</span>+ deliveries across Pakistan</div>
          <div className="trust-item" data-anim="fade-up" data-delay="200"><span className="trust-icon">🛡️</span> <span data-count="2">0</span>-year official warranty</div>
          <div className="trust-item" data-anim="fade-up" data-delay="300"><span className="trust-icon">💳</span> <span data-count="12">0</span> partner installment plans</div>
          <div className="trust-item" data-anim="fade-up" data-delay="400"><span className="trust-icon">⭐</span> 4.9 / 5 rating</div>
          <div className="live-pill" data-anim="zoom-in" data-delay="500" id="liveViewers">Live now: {liveCount} viewing</div>
        </div>

        <div className="ticker-wrap">
          <div className="ticker-track">
            <span>DJI Authorised Store</span><span className="ticker-dot">✦</span>
            <span>Free Delivery Pakistan-Wide</span><span className="ticker-dot">✦</span>
            <span>2-Year Official Warranty</span><span className="ticker-dot">✦</span>
            <span>Same-Day WhatsApp Support</span><span className="ticker-dot">✦</span>
            <span>Repair & Service Centre</span><span className="ticker-dot">✦</span>
            <span>Original Spare Parts Stocked</span><span className="ticker-dot">✦</span>
            <span>DJI Authorised Store</span><span className="ticker-dot">✦</span>
            <span>Free Delivery Pakistan-Wide</span><span className="ticker-dot">✦</span>
            <span>2-Year Official Warranty</span><span className="ticker-dot">✦</span>
            <span>Same-Day WhatsApp Support</span><span className="ticker-dot">✦</span>
            <span>Repair & Service Centre</span><span className="ticker-dot">✦</span>
            <span>Original Spare Parts Stocked</span><span className="ticker-dot">✦</span>
          </div>
        </div>

        <section className="products-section" id="drones">
          <div className="section-label" data-anim="fade-up">Our Collection</div>
          <div className="section-title" data-anim="fade-up" data-delay="100">Choose Your Drone</div>
          <div className="filter-tabs" data-anim="fade-up" data-delay="200">
            {categories.map((item) => (
              <button key={item.key} className={`tab ${filter === item.key ? "active" : ""}`} onClick={() => setFilter(item.key)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <article key={product.id} className="product-card" data-anim="zoom-in" data-delay={String([0, 100, 200, 300, 400, 500][index] || 0)} onClick={() => setQuickView(product)}>
                <div className="card-img">
                  {product.badge ? <div className={`card-badge badge-${product.badge}`}>{product.badgeLabel}</div> : null}
                  <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" />
                </div>
                <div className="card-body">
                  <div className="card-category">{product.category}</div>
                  <div className="card-name">{product.name}</div>
                  <div className="card-desc">{product.desc}</div>
                  <div className="card-tags">{product.tags.map((tag) => <span key={tag} className="card-tag">{tag}</span>)}</div>
                  <div className="card-footer">
                    <div>
                      {product.priceOld ? <div className="card-price-old">{product.priceOld}</div> : null}
                      <div className="card-price">{product.price}</div>
                    </div>
                    <button className="add-btn" onClick={(event) => { event.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="scroll-story" id="why-us-scroll" data-anim="fade-up" ref={storySectionRef}>
          <div className="scroll-story-height">
            <div className="scroll-story-sticky">
              <div className="scroll-story-grid">
                <div className="story-left">
                  {storyPanels.map((panel, index) => (
                    <article key={panel.step} className={`story-panel ${storyActiveIndex === index ? "active" : ""}`} data-story-panel={String(index)}>
                      <div>
                        <div className="story-step">{panel.step}</div>
                        <h3>{panel.title}</h3>
                        <p>{panel.copy}</p>
                      </div>
                      <div className="story-progress">
                        {storyPanels.map((_, dotIndex) => (
                          <span key={dotIndex} className={`story-progress-dot ${dotIndex <= index ? "active" : ""}`} />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="story-right">
                  <div className={`story-media ${storyActiveIndex === 0 ? "active" : ""}`} data-story-media="0">
                    <img src="image3.png" alt="DJI drone in action" loading="lazy" />
                  </div>
                  <div className={`story-media ${storyActiveIndex === 1 ? "active" : ""}`} data-story-media="1">
                    <img src="part2.jpg" alt="DJI spare battery" loading="lazy" />
                  </div>
                  <div className={`story-media ${storyActiveIndex === 2 ? "active" : ""}`} data-story-media="2">
                    <video autoPlay loop muted playsInline>
                      <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be104f9aba74d774b7f4a3_Yoda-Exploded-50-transcode.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-wrap" id="spare-parts">
          <div className="service-block" data-anim="fade-up">
            <div className="service-head" data-anim="slide-left">
              <div className="section-label">Accessories & Parts</div>
              <div className="service-title">Original DJI Spare Parts Available</div>
              <div className="service-sub">Compact ready-stock picks for fast replacement and upgrade.</div>
            </div>
            <div className="parts-grid">
              {spareParts.map((part, index) => (
                <article key={part.name} className="part-card" data-anim="zoom-in" data-delay={String((index + 1) * 100)}>
                  <img className="part-img" src={part.image} alt={part.name} loading="lazy" />
                  <div className="part-body">
                    <div className="part-name">{part.name}</div>
                    <div className="part-price">{part.price}</div>
                    <div className="part-desc">{part.desc}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="service-foot">
              <a className="service-btn" href="https://wa.me/923009400956" target="_blank" rel="noreferrer">💬 Check Spare Part Availability</a>
              <a className="service-btn alt" href="tel:+923009400956">📞 Call for Price List</a>
            </div>
          </div>

          <div className="service-block" data-anim="fade-up" id="repair-services">
            <div className="service-head" data-anim="slide-left">
              <div className="section-label">Workshop Services</div>
              <div className="service-title">Drone Repairing Facilities Also Available</div>
              <div className="service-sub">From minor crashes to advanced board-level issues, our technicians diagnose and repair DJI drones with transparent estimates and test flight checks.</div>
            </div>
            <div className="service-grid">
              <article className="service-item" data-anim="flip-up" data-delay="100"><h4>Crash Damage Repair</h4><p>Arm replacement, shell restoration, landing gear fixes, and motor swaps.</p></article>
              <article className="service-item" data-anim="flip-up" data-delay="200"><h4>Gimbal Calibration</h4><p>Horizon leveling, jitter correction, and camera stabilization tuning.</p></article>
              <article className="service-item" data-anim="flip-up" data-delay="300"><h4>Signal & ESC Issues</h4><p>Controller link troubleshooting, ESC diagnostics, and firmware recovery.</p></article>
              <article className="service-item" data-anim="flip-up" data-delay="400"><h4>Maintenance Checkups</h4><p>Preventive servicing, cleaning, health checks, and performance testing.</p></article>
            </div>
            <div className="service-foot">
              <a className="service-btn" href="https://wa.me/923009400956" target="_blank" rel="noreferrer">🛠️ Book a Repair Slot</a>
              <a className="service-btn alt" href="#location">📍 Visit Service Desk</a>
            </div>
          </div>
        </section>

        <section className="location-section" id="location">
          <div className="location-info" data-anim="slide-left">
            <div className="section-label reveal">Find Us</div>
            <div className="section-title reveal">Visit Our Store</div>
            <div className="location-details">
              <div className="loc-row">
                <div className="loc-icon">📍</div>
                <div>
                  <div className="loc-label">Address</div>
                  <div className="loc-value">Shop #9, Ground Floor, Business 16<br />Hall Road, Garhi Shahu, Lahore</div>
                </div>
              </div>
              <div className="loc-row">
                <div className="loc-icon">📞</div>
                <div>
                  <div className="loc-label">Phone &amp; WhatsApp</div>
                  <div className="loc-value"><a href="tel:+923009400956">0300-9400956</a></div>
                </div>
              </div>
              <div className="loc-row">
                <div className="loc-icon">🕐</div>
                <div>
                  <div className="loc-label">Hours</div>
                  <div className="loc-value">Sunday: Open 24 Hours<br /><span style={{ color: "var(--muted)", fontSize: "13px" }}>Call ahead for weekday availability</span></div>
                </div>
              </div>
              <div className="loc-row">
                <div className="loc-icon">⭐</div>
                <div>
                  <div className="loc-label">Customer Rating</div>
                  <div className="loc-value">4.9 / 5 — "Best drone shop in Lahore"</div>
                </div>
              </div>
            </div>
            <a href="https://maps.app.goo.gl/uqD86A9YLCnu2sBM6" target="_blank" rel="noreferrer" className="directions-btn">Get Directions →</a>
          </div>
          <div className="location-map" data-anim="slide-right">
            <iframe
              title="Store location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8329!2d74.3158505!3d31.5635664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b53935053dd%3A0xca5785369d7e99a6!2sAmir%20electronics!5e0!3m2!1sen!2spk!4v1711700000000!5m2!1sen!2spk"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      <footer data-anim="fade-up">
        <a href="#" className="logo">Amir Electronics</a>
        <div className="footer-links">
          <a href="#drones">Drones</a>
          <a href="#location">Location</a>
          <a href="tel:+923009400956">Contact</a>
          <a href="https://wa.me/923009400956" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <span style={{ fontSize: "12px" }}>© 2025 · Hall Road, Lahore</span>
      </footer>

      <div className={`overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)} />
      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="empty-cart"><span className="empty-icon">🚁</span>Your cart is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-thumb"><img src={item.image} alt={item.name} loading="lazy" referrerPolicy="no-referrer" /></div>
                <div style={{ flex: 1 }}>
                  <div className="item-name">{item.name}{item.qty > 1 ? ` ×${item.qty}` : ""}</div>
                  <div className="item-price">{item.price}</div>
                </div>
                <button className="item-del" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div className="total-row"><span>Total</span><span className="total-amt">PKR {totalPrice.toLocaleString("en-PK")}</span></div>
          <button className="checkout-btn">Proceed to Checkout →</button>
        </div>
      </aside>

      {quickView ? (
        <div className="quickview open" onClick={() => setQuickView(null)}>
          <div className="quickview-card" onClick={(event) => event.stopPropagation()}>
            <img className="quickview-img" src={quickView.image} alt={quickView.name} />
            <div className="quickview-body">
              <button className="quickview-close" onClick={() => setQuickView(null)}>✕</button>
              <div className="card-category">{quickView.category}</div>
              <h3 className="quickview-title">{quickView.name}</h3>
              <p className="quickview-desc">{quickView.desc}</p>
              <div className="quickview-tags">{quickView.tags.map((tag) => <span key={tag} className="card-tag">{tag}</span>)}</div>
              <div className="card-price">{quickView.price}</div>
              <div style={{ marginTop: 16 }}>
                <button className="add-btn" onClick={() => { addToCart(quickView); setQuickView(null); }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`toast ${cartToast ? "show" : ""}`}><span>✓</span><span>{cartToastText}</span></div>
    </>
  );
}

export default App;
