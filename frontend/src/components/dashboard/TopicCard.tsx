import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';

interface TopicCardProps {
  title: string;
  slug: string;
  questionCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  index: number;
  bestScore?: number; // 0–100
}

const DIFFICULTY_COLOR = {
  Beginner:     '#4ade80',
  Intermediate: '#facc15',
  Advanced:     '#f87171',
};

export function TopicCard({ title, slug, questionCount, difficulty, index, bestScore }: TopicCardProps) {
  const color = DIFFICULTY_COLOR[difficulty];
  const pct   = bestScore ?? 0;
  const label = pct > 0 ? `Best: ${pct}%` : '0% complete';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem',
        display: 'flex', flexDirection: 'column', gap: '0.85rem',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer', transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      onClick={() => window.location.href = `/quiz/${slug}`}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {title}
        </h3>
        <div title={difficulty} style={{
          width: 9, height: 9, borderRadius: '50%',
          background: color, flexShrink: 0, marginLeft: '0.5rem',
          boxShadow: `0 0 6px ${color}`,
        }} />
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        {questionCount} questions
      </p>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: index * 0.06 + 0.3, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
            borderRadius: 999,
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.1rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--violet)', fontSize: '0.82rem', fontWeight: 600 }}>
          {pct > 0 ? 'Retry' : 'Start'} <MdArrowForward size={15} />
        </div>
      </div>
    </motion.div>
  );
}