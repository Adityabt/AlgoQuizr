import { FaGithub, FaTwitter } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';

const SOCIAL = [
  { icon: FaGithub,      href: 'https://github.com/Adityabt/DSA-Quiz-App', label: 'GitHub'  },
  { icon: FaTwitter,     href: 'https://twitter.com/AdityaT1105',           label: 'Twitter' },
  { icon: MdOutlineMail, href: 'mailto:adityabt24@gmail.com',               label: 'Email'   },
];

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 1.5rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        {/* Left — logo + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 360, minWidth: 0 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              <img src="/AQLogo.png" alt="DSAquiz logo" style={{ width: 40, height: 40 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', opacity: 0.8 }}>
              Algo<span style={{ fontWeight: 300, opacity: 0.6 }}>Quizr</span>
            </span>
          </a>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Master Data Structures and Algorithms through focused practice and meaningful progress.
          </p>
        </div>

        {/* Right — social icons + copyright stacked */}
        <div className="footer-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  background: 'transparent',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-accent)';
                  e.currentTarget.style.color = 'var(--violet)';
                  e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} DSAquiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}