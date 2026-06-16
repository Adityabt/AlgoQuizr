import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { motion } from 'framer-motion';
import { MdOutlineBarChart, MdOutlineEmojiEvents, MdOutlineQuiz, MdOutlineTrendingUp } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface TopicProgress {
  topic: string;
  score: number;
  attempts: number;
}

interface RecentScore {
  label: string;
  score: number;
}

interface Summary {
  quizzesTaken: number;
  avgScore: number;
  bestScore: number;
  topicsStarted: number;
  dayStreak: number;
}

const ALL_TOPICS = [
  'Arrays', 'Linked Lists', 'Stacks & Queues', 'Sorting', 'Recursion',
  'Trees', 'Binary Search', 'Graphs', 'Backtracking', 'Heaps',
];

const scoreColor = (score: number) => {
  if (score === 0)  return 'var(--border)';
  if (score >= 80)  return '#4ade80';
  if (score >= 50)  return '#facc15';
  return '#f87171';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.9rem', fontSize: '0.82rem',
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ color: 'var(--violet)', fontWeight: 700 }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function Progress() {
  const { token } = useAuth();

  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [recentScores, setRecentScores]   = useState<RecentScore[]>([]);
  const [summary, setSummary]             = useState<Summary | null>(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/quiz/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setSummary(data.summary);
        setRecentScores(data.recentScores ?? []);

        const byTopic: Record<string, { score: number; attempts: number }> = {};
        for (const t of data.topicProgress ?? []) {
          byTopic[t.topic] = { score: t.score ?? 0, attempts: t.attempts ?? 0 };
        }

        setTopicProgress(
          ALL_TOPICS.map(topic => ({
            topic,
            score:    byTopic[topic]?.score    ?? 0,
            attempts: byTopic[topic]?.attempts ?? 0,
          }))
        );
      })
      .catch(err => console.error('Progress fetch failed:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const SUMMARY_STATS = [
    { icon: MdOutlineQuiz,        label: 'Quizzes Taken',  value: loading ? '—' : String(summary?.quizzesTaken  ?? 0)     },
    { icon: MdOutlineTrendingUp,  label: 'Avg Score',      value: loading ? '—' : summary ? `${summary.avgScore}%`  : '—' },
    { icon: MdOutlineEmojiEvents, label: 'Topics Started', value: loading ? '—' : String(summary?.topicsStarted ?? 0)     },
    { icon: MdOutlineBarChart,    label: 'Best Score',     value: loading ? '—' : summary ? `${summary.bestScore}%` : '—' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main className="dashboard-main" style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', overflowY: 'auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>
            Your Progress
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track how you're doing across all topics.
          </p>
        </motion.div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {SUMMARY_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '1.1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color="var(--violet)" />
                </div>
                <div>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{s.value}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart + topic breakdown */}
        <div className="progress-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Recent Quiz Scores</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Last {recentScores.length} attempts</p>
            {loading ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '2rem 0' }}>Loading…</p>
            ) : recentScores.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '2rem 0' }}>No quiz attempts yet.</p>
            ) : (
              <div style={{ flex: 1, minHeight: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recentScores} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {recentScores.map((entry, i) => (
                        <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Topic breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Topic Breakdown</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Best score per topic</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topicProgress.map((t, i) => (
                <motion.div
                  key={t.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', color: t.attempts > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: t.attempts > 0 ? 500 : 400 }}>
                      {t.topic}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: t.attempts > 0 ? scoreColor(t.score) : 'var(--text-muted)', fontWeight: 600 }}>
                      {t.attempts > 0 ? `${t.score}%` : 'Not started'}
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.score}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: 999,
                        background: t.score >= 80 ? 'linear-gradient(90deg, #4ade80, #22d3ee)'
                          : t.score >= 50 ? 'linear-gradient(90deg, #facc15, #fb923c)'
                          : t.score > 0  ? 'linear-gradient(90deg, #f87171, #fb923c)'
                          : 'transparent',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) { .dashboard-main { padding-top: 72px !important; } }
        @media (max-width: 900px) {
          .progress-grid { grid-template-columns: 1fr !important; }
          .progress-grid > div { height: auto !important; max-height: none !important; }
        }
      `}</style>
    </div>
  );
}