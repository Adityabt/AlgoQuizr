import { useEffect, useRef, useState } from 'react';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, logout }  = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const logoHref = isLoggedIn ? '/' : '/';

  return (
    <>
      <header
        className="navbar-shell"
        style={{
          zIndex: 100,
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
          background: scrolled ? 'rgba(7,8,15,0.75)' : 'transparent',
          border: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          borderRadius: 100,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <nav style={{
          padding: '0 1.5rem', height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <a href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 100 }}>
              <img src="/AQLogo.png" alt="AlgoQuizr logo" style={{ width: 40, height: 40 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
              Algo<span style={{ fontWeight: 300, opacity: 0.6 }}>Quizr</span>
            </span>
          </a>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <NavLinks />
            {isLoggedIn && (
              <a href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
                transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Dashboard
              </a>
            )}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
            {isLoggedIn ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {user?.name?.split(' ')[0] ?? 'User'}
                  </span>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 180,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '0.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 200,
                  }}>
                    {[
                      { label: 'Profile',  href: '/profile'  },
                      { label: 'Settings', href: '/settings' },
                    ].map(({ label, href }) => (
                      <a key={label} href={href}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'block', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)', fontSize: '0.88rem', textDecoration: 'none',
                          transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {label}
                      </a>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', margin: '0.4rem 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)',
                        color: '#f87171', fontSize: '0.88rem', background: 'transparent',
                        border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Log in</a>
                <a
                  href="/signup"
                  style={{
                    background: 'linear-gradient(75deg, var(--violet), var(--cyan))',
                    color: '#fff', padding: '0.5rem 1.1rem', borderRadius: 100,
                    fontSize: '0.875rem', fontWeight: 600,
                    boxShadow: '0 0 16px rgba(139,92,246,0.3)',
                    transition: 'opacity 0.2s, box-shadow 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 0 16px rgba(139,92,246,0.3)'; }}
                >
                  Get started
                </a>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.25rem' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="13" x2="19" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}