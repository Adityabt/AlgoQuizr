import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdCheckCircle, MdCancel, MdArrowForward } from 'react-icons/md';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface TopicMeta {
  name: string;
  difficulty: string;
  questionCount: number;
}

type Phase = 'quiz' | 'results';

export default function Quiz() {
  const { topic }    = useParams<{ topic: string }>();
  const navigate     = useNavigate();
  const { token }    = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicMeta, setTopicMeta] = useState<TopicMeta | null>(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  const [selected, setSelected]   = useState<(number | null)[]>([]);
  const [phase, setPhase]         = useState<Phase>('quiz');
  const [revealed, setRevealed]   = useState<boolean[]>([]);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/quiz/topics/${topic}/questions`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setTopicMeta(data.topic);
        setQuestions(data.questions);
        setSelected(Array(data.questions.length).fill(null));
        setRevealed(Array(data.questions.length).fill(false));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [topic]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading questions…</p>
      </div>
    );
  }

  if (notFound || questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Topic not found.</p>
          <button onClick={() => navigate('/dashboard')} style={{ color: 'var(--violet)', fontWeight: 600 }}>← Back to dashboard</button>
        </div>
      </div>
    );
  }

  const score      = selected.filter((s, i) => s === questions[i].answer).length;
  const allAnswered = selected.every(s => s !== null);

  const handleSubmit = async () => {
    setRevealed(Array(questions.length).fill(true));
    setPhase('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save attempt if logged in
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/quiz/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ topic, score, total: questions.length }),
        });
      } catch (err) {
        console.error('Failed to save attempt:', err);
      }
    }
  };

  const handleRetry = () => {
    setSelected(Array(questions.length).fill(null));
    setRevealed(Array(questions.length).fill(false));
    setPhase('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1.5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <MdArrowBack size={18} /> Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              padding: '4px 14px',
              borderRadius: 999,
              background: 'var(--violet-dim)',
              border: '1px solid var(--border-accent)',
              color: 'var(--violet)',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {topicMeta?.name ?? topic}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {questions.length} questions
            </span>
          </div>
        </div>

        {/* Results banner */}
        <AnimatePresence>
          {phase === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                marginBottom: '2.5rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: score >= questions.length * 0.8
                  ? 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)'
                  : score >= questions.length * 0.5
                  ? 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(250,204,21,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <p style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                {score}/{questions.length}
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {score >= questions.length * 0.8
                  ? '🔥 Excellent work!'
                  : score >= questions.length * 0.5
                  ? '👍 Good effort, keep going!'
                  : "💪 Keep practicing, you'll get there!"}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRetry}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/practice')}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--violet)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Next topic <MdArrowForward size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q, qi) => {
            const userAnswer = selected[qi];
            const isRevealed = revealed[qi];
            const isCorrect  = userAnswer === q.answer;

            return (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: qi * 0.05 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: isRevealed
                    ? isCorrect ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)'
                    : '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Question header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{
                    minWidth: 26, height: 26, borderRadius: '50%',
                    background: isRevealed
                      ? isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'
                      : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    color: isRevealed
                      ? isCorrect ? '#4ade80' : '#f87171'
                      : 'var(--text-muted)',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    {qi + 1}
                  </span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.55, color: 'var(--text-primary)' }}>
                    {q.question}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginLeft: '2.1rem' }}>
                  {q.options.map((opt, oi) => {
                    const isSelected = userAnswer === oi;
                    const isAnswer   = q.answer === oi;

                    let bg     = 'var(--bg-elevated)';
                    let border = '1px solid var(--border)';
                    let color  = 'var(--text-secondary)';

                    if (isRevealed) {
                      if (isAnswer) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid rgba(34,197,94,0.3)'; color = '#4ade80'; }
                      else if (isSelected) { bg = 'rgba(239,68,68,0.1)'; border = '1px solid rgba(239,68,68,0.3)'; color = '#f87171'; }
                    } else if (isSelected) {
                      bg = 'rgba(139,92,246,0.1)'; border = '1px solid rgba(139,92,246,0.35)'; color = 'var(--violet)';
                    }

                    return (
                      <button
                        key={oi}
                        disabled={isRevealed}
                        onClick={() => {
                          if (isRevealed) return;
                          const updated = [...selected];
                          updated[qi] = oi;
                          setSelected(updated);
                        }}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '0.7rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: bg, border, color,
                          fontSize: '0.88rem',
                          cursor: isRevealed ? 'default' : 'pointer',
                          transition: 'all 0.18s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => { if (!isRevealed && !isSelected) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; }}
                        onMouseLeave={e => { if (!isRevealed && !isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <span>{opt}</span>
                        {isRevealed && isAnswer && <MdCheckCircle size={17} color="#4ade80" style={{ flexShrink: 0 }} />}
                        {isRevealed && isSelected && !isAnswer && <MdCancel size={17} color="#f87171" style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        marginTop: '1rem', marginLeft: '2.1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(139,92,246,0.06)',
                        border: '1px solid rgba(139,92,246,0.15)',
                        overflow: 'hidden',
                      }}
                    >
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--violet)', fontWeight: 600 }}>Explanation: </span>
                        {q.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Submit button */}
        {phase === 'quiz' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            {!allAnswered && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {selected.filter(s => s !== null).length}/{questions.length} answered
              </span>
            )}
            <motion.button
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              disabled={!allAnswered}
              onClick={handleSubmit}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-sm)',
                background: allAnswered ? 'linear-gradient(135deg, var(--violet), var(--cyan))' : 'var(--bg-elevated)',
                color: allAnswered ? '#fff' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.95rem',
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                border: 'none', transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
            >
              Submit answers
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}