import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

const TOPICS = ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting', 'Heaps'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoggedIn, user } = useAuth();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const firstName = user?.name?.split(' ')[0] ?? 'back';

  return (
    <section
      ref={sectionRef}
      style={{ height: '100vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          style={{
            y,
            opacity,
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            padding: '0 1.5rem',
          }}
        >

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            {isLoggedIn ? (
              <>
                Welcome back,{' '}
                <span style={{
                  background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {firstName}
                </span>
              </>
            ) : (
              <>
                Practice DSA{' '}
                <span style={{
                  background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  like a pro
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: 520,
              margin: '0 auto 2.5rem',
            }}
          >
            {isLoggedIn
              ? 'Pick up where you left off. Your progress is saved and ready.'
              : 'Topic-by-topic quizzes on every major DSA concept. Practice at your own pace, track what you know, and get interview-ready.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <a
              href={isLoggedIn ? '/practice' : '/signup'}
              style={{
                background: 'linear-gradient(240deg, var(--violet), var(--cyan))',
                color: '#fff',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 0 24px rgba(139,92,246,0.3)',
                transition: 'box-shadow 0.2s, opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(139,92,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.3)'; }}
            >
              {isLoggedIn ? 'Continue practicing' : 'Start practicing'}
            </a>
            <a
              href="#features"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'border-color 0.2s, color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center', marginRight: 4 }}>Topics:</span>
            {TOPICS.map(topic => (
              <span
                key={topic}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: 999,
                  padding: '0.2rem 0.7rem',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                }}
              >
                {topic}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}