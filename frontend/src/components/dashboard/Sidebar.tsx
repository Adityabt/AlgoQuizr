import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdOutlineDashboard, MdOutlineQuiz, MdOutlineBarChart, MdOutlineSettings, MdOutlineLogout, MdMenu, MdClose } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth'
const NAV_ITEMS = [
  { icon: MdOutlineDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: MdOutlineQuiz,      label: 'Practice',  href: '/practice'  },
  { icon: MdOutlineBarChart,  label: 'Progress',  href: '/progress'  },
  { icon: MdOutlineSettings,  label: 'Settings',  href: '/settings'  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const userName = user?.name?.split(' ')[0] ?? 'You';
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem 0' }}>

      {/* Logo + collapse toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '0 1.25rem',
        marginBottom: '2rem',
      }}>
        {!collapsed && (
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <img src="/AQLogo.png" alt="AlgoQuizr" style={{ width: 30, height: 30 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
              Algo<span style={{ fontWeight: 300, opacity: 0.6 }}>Quizr</span>
            </span>
          </a>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ color: 'var(--text-muted)', padding: '0.25rem', lineHeight: 0 }}
          className="collapse-btn"
        >
          {collapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <a
              key={label}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
                border: active ? '1px solid rgba(139,92,246,0.18)' : '1px solid transparent',
                fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                transition: 'all 0.18s', whiteSpace: 'nowrap', overflow: 'hidden',
                justifyContent: collapsed ? 'center' : 'flex-start', textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </a>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '0 0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        {!collapsed && (
          <a
            href="/profile"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.75rem', marginBottom: '0.25rem',
              borderRadius: 'var(--radius-sm)', textDecoration: 'none',
              background: pathname === '/profile' ? 'rgba(139,92,246,0.08)' : 'transparent',
              border: pathname === '/profile' ? '1px solid rgba(139,92,246,0.18)' : '1px solid transparent',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { if (pathname !== '/profile') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (pathname !== '/profile') e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>View profile</p>
            </div>
          </a>
        )}

        {collapsed && (
          <a
            href="/profile"
            title="View profile"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.6rem 0.75rem', marginBottom: '0.25rem',
              borderRadius: 'var(--radius-sm)', textDecoration: 'none',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff',
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </a>
        )}

        <a
          onClick={() => { logout(); window.location.href = '/'; }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.18s',
            justifyContent: collapsed ? 'center' : 'flex-start', textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          title={collapsed ? 'Log out' : undefined}
        >
          <MdOutlineLogout size={19} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Log out</span>}
        </a>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="sidebar-desktop"
        style={{
          width: collapsed ? 64 : 220, minHeight: '100vh',
          background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
          flexShrink: 0, transition: 'width 0.22s ease', position: 'sticky', top: 0, overflow: 'hidden',
        }}
      >
        {sidebarContent}
      </aside>

      <div
        className="sidebar-mobile-bar"
        style={{
          display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          zIndex: 90, alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem',
        }}
      >
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src="/AQLogo.png" alt="AlgoQuizr" style={{ width: 28, height: 28 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
            Algo<span style={{ fontWeight: 300, opacity: 0.6 }}>Quizr</span>
          </span>
        </a>
        <button onClick={() => setMobileOpen(o => !o)} style={{ color: 'var(--text-primary)', lineHeight: 0 }}>
          {mobileOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 91 }} />
          <aside style={{ position: 'fixed', top: 56, left: 0, bottom: 0, width: 220, background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', zIndex: 92, overflow: 'auto' }}>
            {sidebarContent}
          </aside>
        </>
      )}

      <style>{`
        @media (max-width: 767px) {
          .sidebar-desktop    { display: none !important; }
          .sidebar-mobile-bar { display: flex !important; }
          .collapse-btn       { display: none; }
        }
      `}</style>
    </>
  );
}