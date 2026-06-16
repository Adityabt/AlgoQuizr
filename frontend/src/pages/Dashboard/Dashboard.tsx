import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { StatsBar } from '../../components/dashboard/StatsBar';
import { TopicCard } from '../../components/dashboard/TopicCard';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

interface TopicProgress {
  topic: string;   // slug
  bestPct: number;
  attempts: number;
}

interface ProgressData {
  summary: {
    quizzesTaken: number;
    avgScore: number;
    bestScore: number;
    topicsStarted: number;
    dayStreak: number;
  };
  topicProgress: TopicProgress[];
}

interface Topic {
  slug: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
}

export default function Dashboard() {
  const { token, user } = useAuth();

  const [topics, setTopics]       = useState<Topic[]>([]);
  const [progress, setProgress]   = useState<ProgressData | null>(null);
  const [loading, setLoading]     = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  useEffect(() => {
    // Fetch topics (public) and progress (auth) in parallel
    const topicsFetch = fetch(`${API_BASE_URL}/quiz/topics`).then(r => r.json());

    const progressFetch = token
      ? fetch(`${API_BASE_URL}/quiz/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json())
      : Promise.resolve(null);

    Promise.all([topicsFetch, progressFetch])
      .then(([topicsData, progressData]) => {
        setTopics(topicsData);
        setProgress(progressData);
      })
      .catch(err => console.error('Dashboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, [token]);

  // Build a slug → bestPct map from progress data
  const progressMap = new Map<string, number>(
    (progress?.topicProgress ?? []).map(p => [p.topic, p.bestPct])
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main
        className="dashboard-main"
        style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', overflowY: 'auto' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.3rem',
          }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Pick a topic and start practicing.
          </p>
        </motion.div>

        {/* Stats */}
        <StatsBar
          quizzesTaken={progress?.summary.quizzesTaken ?? 0}
          avgScore={progress?.summary.avgScore ?? null}
          dayStreak={progress?.summary.dayStreak ?? 0}
          topicsStarted={progress?.summary.topicsStarted ?? 0}
          totalTopics={topics.length}
        />

        {/* Topic grid */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.05rem',
            fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)',
          }}>
            All Topics
          </h2>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1rem',
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  height: 160, borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)', opacity: 0.5,
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1rem',
            }}>
              {topics.map((topic, i) => (
                <TopicCard
                  key={topic.slug}
                  slug={topic.slug}
                  title={topic.name}
                  questionCount={topic.questionCount}
                  difficulty={topic.difficulty}
                  index={i}
                  bestScore={progressMap.get(topic.slug)}
                />
              ))}
            </div>
          )}
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