import { motion } from 'framer-motion';
import { MdOutlineQuiz, MdOutlineBarChart, MdOutlineLocalFireDepartment, MdOutlineEmojiEvents } from 'react-icons/md';

interface StatsBarProps {
  quizzesTaken: number;
  avgScore: number | null;
  dayStreak: number;
  topicsStarted: number;
  totalTopics: number;
}

export function StatsBar({ quizzesTaken, avgScore, dayStreak, topicsStarted, totalTopics }: StatsBarProps) {
  const STATS = [
    { icon: MdOutlineQuiz,                label: 'Quizzes Taken', value: String(quizzesTaken),                          unit: ''  },
    { icon: MdOutlineBarChart,            label: 'Avg Score',     value: avgScore != null ? String(avgScore) : '—',     unit: avgScore != null ? '%' : '' },
    { icon: MdOutlineLocalFireDepartment, label: 'Day Streak',    value: String(dayStreak),                             unit: 'd' },
    { icon: MdOutlineEmojiEvents,         label: 'Topics Done',   value: `${topicsStarted}/${totalTopics}`,             unit: ''  },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '2.5rem',
    }}>
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <div style={{
              width: 38, height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color="var(--violet)" />
            </div>
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                {s.value}
                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 2 }}>{s.unit}</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}