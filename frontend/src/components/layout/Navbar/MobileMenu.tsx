import { AnimatePresence, motion } from 'framer-motion';
import { NavLinks } from './NavLinks';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)', zIndex: 40,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 64, left: 12, right: 12,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              zIndex: 50, display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}
          >
            <NavLinks onClick={onClose} />

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isLoggedIn ? (
                <>
                  {/* User info row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.25rem 0', marginBottom: '0.25rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.82rem', fontWeight: 700, color: '#fff',
                    }}>
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name ?? 'User'}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email ?? ''}</p>
                    </div>
                  </div>

                  <a href="/dashboard" onClick={onClose}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                    Dashboard
                  </a>
                  <a href="/profile" onClick={onClose}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                    Profile
                  </a>
                  <a href="/settings" onClick={onClose}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                      color: '#f87171', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem', fontWeight: 600, textAlign: 'center',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Log in</a>
                  <a
                    href="/signup"
                    style={{
                      background: 'var(--violet)', color: '#fff',
                      padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none',
                    }}
                  >
                    Get started
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}