import React, { useState, useEffect } from "react";
import { Code2, Menu, X } from "lucide-react";

function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ["home", "about", "features", "languages", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActiveSection(sections[i]); break; }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Languages", href: "#languages" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className={`landing-navbar ${scrolled ? "landing-navbar--scrolled" : ""}`}>
        <nav className="landing-navbar__inner">
          {/* Logo */}
          <a href="#home" className="landing-navbar__logo" onClick={(e) => handleNavClick(e, "#home")}>
            <div className="landing-navbar__logo-icon"><Code2 size={20} /></div>
            <span className="landing-navbar__logo-text">
              Code<span className="landing-navbar__logo-accent">Sphere</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="landing-navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`landing-navbar__link ${activeSection === link.href.replace("#", "") ? "landing-navbar__link--active" : ""}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="landing-navbar__actions">
            <button onClick={() => onOpenAuth("login")} className="landing-navbar__login-btn">
              Sign In
            </button>
            <button onClick={() => onOpenAuth("signup")} className="landing-navbar__signup-btn">
              Sign Up
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="landing-navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="landing-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="landing-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <nav className="landing-mobile-nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`landing-mobile-link ${activeSection === link.href.replace("#", "") ? "landing-mobile-link--active" : ""}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="landing-mobile-actions">
              <button onClick={() => { onOpenAuth("login"); setMobileOpen(false); }} className="landing-mobile-login-btn">
                Sign In
              </button>
              <button onClick={() => { onOpenAuth("signup"); setMobileOpen(false); }} className="landing-mobile-signup-btn">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;