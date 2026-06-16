import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/dashboard/Sidebar';
import {
  MdOutlineCalendarToday, MdOutlineQuiz, MdOutlineEmojiEvents,
  MdOutlineTrendingUp, MdOutlineEdit, MdOutlineLocalFireDepartment,
  MdCheckCircle,
} from 'react-icons/md';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

interface Attempt {
  id: string;
  topic: string;
  score: number;
  total: number;
  date: string;
}

interface ProgressSummary {
  quizzesTaken: number;
  avgScore: number;
  bestScore: number;
  topicsStarted: number;
  dayStreak: number;
}

const BADGE_DEFINITIONS = [
  { label: 'First Quiz',     desc: 'Completed your first quiz',          color: '#8b5cf6', earned: (s: ProgressSummary) => s.quizzesTaken >= 1    },
  { label: 'Perfect Score',  desc: 'Got 100% on any topic',              color: '#22d3ee', earned: (s: ProgressSummary) => s.bestScore === 100     },
  { label: 'On a Roll',      desc: 'Completed 5 quizzes',                color: '#f59e0b', earned: (s: ProgressSummary) => s.quizzesTaken >= 5     },
  { label: 'Consistent',     desc: 'Practiced 7 days in a row',          color: '#f43f5e', earned: (s: ProgressSummary) => s.dayStreak >= 7        },
  { label: 'Topic Explorer', desc: 'Tried 7 or more different topics',   color: '#a78bfa', earned: (s: ProgressSummary) => s.topicsStarted >= 7    },
  { label: 'High Achiever',  desc: 'Averaged 80%+ across all quizzes',   color: '#4ade80', earned: (s: ProgressSummary) => s.avgScore >= 80        },
];

const scoreColor = (score: number, total: number) => {
  const pct = (score / total) * 100;
  if (pct >= 80) return '#4ade80';
  if (pct >= 50) return '#facc15';
  return '#f87171';
};

const scoreLabel = (score: number, total: number) => {
  const pct = (score / total) * 100;
  if (pct === 100) return 'Perfect';
  if (pct >= 80)   return 'Great';
  if (pct >= 60)   return 'Good';
  if (pct >= 40)   return 'Fair';
  return 'Retry';
};

const slugify = (topic: string) =>
  topic.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');

export default function Profile() {
  const { token, user } = useAuth();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [summary, setSummary]   = useState<ProgressSummary | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE_URL}/quiz/attempts?limit=20`, { headers }).then(r => r.json()),
      fetch(`${API_BASE_URL}/quiz/progress`, { headers }).then(r => r.json()),
    ])
      .then(([attemptsData, progressData]) => {
        setAttempts(attemptsData);
        setSummary(progressData.summary);
      })
      .catch(err => console.error('Profile fetch failed:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const badges = BADGE_DEFINITIONS.map(b => ({
    ...b,
    isEarned: summary ? b.earned(summary) : false,
  }));
  const earnedCount = badges.filter(b => b.isEarned).length;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const STATS = [
    { icon: MdOutlineQuiz,                label: 'Quizzes Taken', value: String(summary?.quizzesTaken ?? 0)            },
    { icon: MdOutlineTrendingUp,          label: 'Avg Score',     value: summary ? `${summary.avgScore}%` : '—'        },
    { icon: MdOutlineEmojiEvents,         label: 'Best Score',    value: summary ? `${summary.bestScore}%` : '—'       },
    { icon: MdOutlineLocalFireDepartment, label: 'Day Streak',    value: String(summary?.dayStreak ?? 0)                },
    { icon: MdOutlineCalendarToday,       label: 'Topics Tried',  value: String(summary?.topicsStarted ?? 0)           },
    { icon: MdCheckCircle,                label: 'Badges Earned', value: String(earnedCount)                           },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main className="dashboard-main" style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', overflowY: 'auto' }}>

        {/* Profile hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '1.25rem',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-display)', flexShrink: 0,
              boxShadow: '0 0 28px rgba(124,58,237,0.4)',
            }}>
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                {user?.name ?? '—'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                {user?.email ?? '—'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <MdOutlineCalendarToday size={13} /> Joined {joinedDate}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '3px 10px', borderRadius: 999,
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                  color: 'var(--violet)', fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {user?.plan ?? 'Free'} Plan
                </div>
              </div>
            </div>

            {/* Edit button */}
            <a
              href="/settings"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', color: 'var(--text-secondary)',
                fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.2s',
                flexShrink: 0, textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--violet)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <MdOutlineEdit size={15} /> Edit profile
            </a>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 + i * 0.06 }}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '1rem 1.1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={17} color="var(--violet)" />
                </div>
                <div>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                    {loading ? '—' : s.value}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Badges + History */}
        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>Badges</p>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {earnedCount} of {badges.length} earned
              </p>
            </div>
            <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {badges.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                  title={b.desc}
                  style={{
                    padding: '0.85rem', borderRadius: 'var(--radius-md)',
                    border: b.isEarned ? `1px solid ${b.color}30` : '1px solid var(--border)',
                    background: b.isEarned ? `${b.color}0d` : 'rgba(255,255,255,0.02)',
                    opacity: b.isEarned ? 1 : 0.45,
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: b.isEarned ? `${b.color}20` : 'var(--bg-elevated)',
                    border: b.isEarned ? `1px solid ${b.color}40` : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', marginBottom: '0.5rem',
                    color: b.isEarned ? b.color : 'var(--text-muted)',
                  }}>
                    {b.isEarned ? '★' : '○'}
                  </div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: b.isEarned ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: '0.15rem' }}>
                    {b.label}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{b.desc}</p>
                  {b.isEarned && (
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <MdCheckCircle size={14} color={b.color} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quiz history */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>Quiz History</p>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Last {attempts.length} attempts
              </p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <p style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</p>
              ) : attempts.length === 0 ? (
                <p style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No quizzes taken yet.</p>
              ) : (
                attempts.map((h, i) => {
                  const pct   = Math.round((h.score / h.total) * 100);
                  const color = scoreColor(h.score, h.total);
                  const label = scoreLabel(h.score, h.total);
                  const date  = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <motion.a
                      key={h.id}
                      href={`/quiz/${slugify(h.topic)}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: 0.3 + i * 0.05 }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.9rem 1.5rem', gap: '1rem',
                        borderBottom: i < attempts.length - 1 ? '1px solid var(--border)' : 'none',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                          background: `${color}18`, border: `1px solid ${color}35`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
                          <span style={{ fontSize: '0.55rem', color, opacity: 0.8, marginTop: 1 }}>{label}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {h.topic}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            {h.score}/{h.total} correct
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{date}</p>
                    </motion.a>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) { .dashboard-main { padding-top: 72px !important; } }
        @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}