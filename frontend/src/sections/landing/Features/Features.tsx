import { motion } from 'framer-motion';
import {
  MdOutlineQuiz, MdOutlineBarChart, MdOutlineLightbulb,
  MdOutlineTune, MdOutlineLocalFireDepartment, MdOutlineEmojiEvents,
  MdOutlineChecklist, MdOutlinePlayCircle, MdOutlineInsights,
} from 'react-icons/md';

const FEATURES = [
  {
    icon: MdOutlineQuiz,
    title: 'Topic-focused quizzes',
    desc: "Practice one concept at a time, from arrays and linked lists to trees and graphs. Stay focused on the skills you want to improve.",
  },
  {
    icon: MdOutlineBarChart,
    title: 'Track your progress',
    desc: "Monitor completed topics, identify weak areas, and build confidence with consistent practice. No clutter, just meaningful insights.",
  },
  {
    icon: MdOutlineLightbulb,
    title: 'Explanations included',
    desc: 'Every quiz includes detailed explanations so you understand the reasoning behind each answer, not just whether it was correct.',
  },
  {
    icon: MdOutlineTune,
    title: 'Difficulty levels',
    desc: 'Choose between beginner, intermediate, and advanced questions for each topic, so practice always matches where you currently are.',
  },
  {
    icon: MdOutlineLocalFireDepartment,
    title: 'Build a streak',
    desc: 'Keep a daily practice streak going. Short, consistent sessions add up to stronger recall than occasional long ones.',
  },
  {
    icon: MdOutlineEmojiEvents,
    title: 'Earn badges',
    desc: 'Unlock badges for milestones like your first quiz, a perfect score, or a multi-day streak as you work through topics.',
  },
];

const STEPS = [
  {
    icon: MdOutlineChecklist,
    number: '01',
    title: 'Pick a topic',
    desc: 'Choose a DSA topic and a difficulty level that matches your current comfort with it.',
  },
  {
    icon: MdOutlinePlayCircle,
    number: '02',
    title: 'Take the quiz',
    desc: 'Work through a focused set of questions for that topic at your own pace.',
  },
  {
    icon: MdOutlineInsights,
    number: '03',
    title: 'Review & track',
    desc: 'Read the explanation for each question, then check your progress page to see what to revisit next.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      style={{ padding: '5rem 1.5rem', width: '100%', maxWidth: 1100, margin: '0 auto' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '3rem', textAlign: 'center' }}
      >
        <p style={{ color: 'var(--violet)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          What you get
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Built for focused practice
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '4.5rem' }}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                transition: 'border-color 0.25s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
                marginBottom: '1.25rem',
              }}>
                <Icon size={22} color="var(--violet)" />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '2.5rem', textAlign: 'center' }}
      >
        <p style={{ color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          How it works
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Three steps to sharper recall
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              style={{ position: 'relative', padding: '0 0.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(34,211,238,0.1)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  flexShrink: 0,
                }}>
                  <Icon size={20} color="var(--cyan)" />
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.85,
                }}>
                  {s.number}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}