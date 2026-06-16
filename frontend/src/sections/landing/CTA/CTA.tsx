import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';
import { useAuth } from '../../../hooks/useAuth';

export default function CTA() {
  const { isLoggedIn } = useAuth();

  return (
    <section style={{ padding: '5rem 1.5rem', width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 680,
          margin: '0 auto',
          textAlign: 'center',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2.5rem, 6vw, 4rem) 2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-surface)', zIndex: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(124,58,237,0.18) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(99,102,241,0.14) 0%, transparent 55%)',
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)',
          ].join(', '),
          zIndex: 1, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
          zIndex: 2, pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 3 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 999, padding: '0.25rem 0.85rem',
            fontSize: '0.75rem', fontWeight: 600, color: 'var(--violet)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', display: 'inline-block' }} />
            {isLoggedIn ? 'Keep going' : 'Free to start'}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>
            {isLoggedIn ? 'Pick up where you left off' : 'Ready to start?'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.65 }}>
            {isLoggedIn
              ? 'Your progress is saved. Jump back in and keep building your skills.'
              : 'Pick a topic, take a quiz, and see where you stand.'}
          </p>

          <a
            href={isLoggedIn ? '/practice' : '/signup'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(75deg, var(--cyan), var(--violet))',
              color: '#fff', padding: '0.75rem 2rem', borderRadius: 'var(--radius-sm)',
              fontWeight: 600, fontSize: '0.95rem',
              boxShadow: '0 0 24px rgba(139,92,246,0.35)',
              transition: 'box-shadow 0.2s, gap 0.2s', textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 36px rgba(139,92,246,0.55)'; e.currentTarget.style.gap = '0.75rem'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.35)'; e.currentTarget.style.gap = '0.5rem'; }}
          >
            {isLoggedIn ? 'Go to practice' : 'Create free account'}
            <MdArrowForward size={17} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}