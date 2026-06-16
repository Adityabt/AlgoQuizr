import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { MdSearch, MdArrowForward } from 'react-icons/md';
import { API_BASE_URL } from '../../config/api';

interface Topic {
  slug: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
}

const DIFFICULTY_DOT: Record<string, string> = {
  Beginner:     '#4ade80',
  Intermediate: '#facc15',
  Advanced:     '#f87171',
};

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Practice() {
  const [topics, setTopics]   = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/quiz/topics`)
      .then(r => r.json())
      .then((data: Topic[]) => setTopics(data))
      .catch(err => console.error('Failed to load topics:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = topics.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      <main className="dashboard-main" style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', overflowY: 'auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>
            Practice
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Filter by topic or difficulty and jump straight in.
          </p>
        </motion.div>

        {/* Search + filter row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}
        >
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
            <MdSearch size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics…"
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.18s',
                  background: filter === f ? 'rgba(139,92,246,0.12)' : 'var(--bg-surface)',
                  border: filter === f ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border)',
                  color: filter === f ? 'var(--violet)' : 'var(--text-muted)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {loading ? 'Loading…' : `${filtered.length} topic${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Topic list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`skel-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    height: 64,
                    opacity: 0.5,
                  }}
                />
              ))
            ) : filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '2rem 0' }}
              >
                No topics match your search.
              </motion.p>
            ) : (
              filtered.map((t, i) => (
                <motion.div
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.18s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  onClick={() => window.location.href = `/quiz/${t.slug}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                    <div
                      title={t.difficulty}
                      style={{
                        width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                        background: DIFFICULTY_DOT[t.difficulty],
                        boxShadow: `0 0 6px ${DIFFICULTY_DOT[t.difficulty]}`,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {t.name}
                      </p>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {t.questionCount} questions · {t.difficulty}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--violet)', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>
                    Start <MdArrowForward size={15} />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) {
          .dashboard-main { padding-top: 72px !important; }
        }
      `}</style>
    </div>
  );
}