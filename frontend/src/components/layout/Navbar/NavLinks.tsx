import { NAV_LINKS } from '../../../constants/theme';
import { useAuth } from '../../../hooks/useAuth';

interface NavLinksProps {
  onClick?: () => void;
  className?: string;
}

export function NavLinks({ onClick, className = '' }: NavLinksProps) {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {NAV_LINKS.map(({ label, href }) => {
        // "Practice" routes differently depending on auth state:
        // logged in -> dashboard practice page, logged out -> login (with redirect back)
        const resolvedHref =
          label === 'Practice'
            ? isLoggedIn ? '/practice' : '/login?redirect=/practice'
            : href;

        return (
          <a
            key={label}
            href={resolvedHref}
            onClick={onClick}
            className={className}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {label}
          </a>
        );
      })}
    </>
  );
}