import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/aftermovie', label: 'Aftermovie' },
    { path: '/accommodation', label: 'Accommodation' },
    { path: '/merch', label: 'Merch' },
    { path: '/faq', label: 'FAQ' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Small floating menu button */}
      <button
        className={`nav-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Navigation"
      >
        <span className="toggle-icon">☰</span>
      </button>

      {/* Compact dropdown menu */}
      <nav className={`mini-nav ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mini-link ${isActive(link.path) ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {isOpen && <div className="mini-overlay" onClick={closeMenu}></div>}

      <style>{`
        .nav-toggle {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 1001;
          width: 36px;
          height: 36px;
          background: rgba(24, 24, 27, 0.9);
          border: 1px solid rgba(161, 161, 170, 0.2);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }

        .nav-toggle:hover {
          background: rgba(24, 24, 27, 1);
          border-color: #10b981;
        }

        .nav-toggle.open {
          background: #10b981;
          border-color: #10b981;
        }

        .toggle-icon {
          font-size: 16px;
          color: #a1a1aa;
          transition: all 0.2s;
        }

        .nav-toggle:hover .toggle-icon,
        .nav-toggle.open .toggle-icon {
          color: #fff;
        }

        .mini-nav {
          position: fixed;
          top: 54px;
          right: 12px;
          z-index: 1000;
          background: rgba(24, 24, 27, 0.95);
          border: 1px solid rgba(161, 161, 170, 0.15);
          border-radius: 10px;
          backdrop-filter: blur(12px);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
          pointer-events: none;
          transition: all 0.2s ease;
          min-width: 140px;
        }

        .mini-nav.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .mini-link {
          padding: 8px 12px;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 13px;
          border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .mini-link:hover {
          color: #fafafa;
          background: rgba(255, 255, 255, 0.08);
        }

        .mini-link.active {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }

        .mini-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
        }
      `}</style>
    </>
  );
}
