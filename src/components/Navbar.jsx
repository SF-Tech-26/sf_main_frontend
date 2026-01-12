import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎭 Spring Fest
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(24, 24, 27, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(161, 161, 170, 0.1);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .navbar-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          text-decoration: none;
          white-space: nowrap;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .navbar-link {
          padding: 0.5rem 0.875rem;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.9rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .navbar-link:hover {
          color: #fafafa;
          background: rgba(255, 255, 255, 0.05);
        }

        .navbar-link.active {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.75rem 1rem;
            flex-wrap: wrap;
          }

          .navbar-links {
            order: 3;
            width: 100%;
            justify-content: center;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(161, 161, 170, 0.1);
            margin-top: 0.5rem;
          }

          .navbar-link {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
}
