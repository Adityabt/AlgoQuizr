import { motion } from 'framer-motion';

const LAST_UPDATED = 'June 2026';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By creating an account or using AlgoQuizr, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. We reserve the right to update these terms at any time — continued use after changes constitutes acceptance.`,
  },
  {
    title: '2. What AlgoQuizr Is',
    content: `AlgoQuizr is a Data Structures and Algorithms practice platform designed to help students and developers prepare for technical interviews. The platform provides topic-based quizzes, progress tracking, and explanations for each question. AlgoQuizr is currently offered free of charge.`,
  },
  {
    title: '3. Your Account',
    content: `You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account. You must notify us immediately at adityabt24@gmail.com if you suspect unauthorised access to your account. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '4. Acceptable Use',
    content: `You agree not to misuse AlgoQuizr. This includes but is not limited to: attempting to gain unauthorised access to any part of the platform or its backend systems; scraping, copying, or reproducing quiz content in bulk; using automated tools or bots to complete quizzes; sharing account credentials with others; or engaging in any activity that disrupts or degrades the platform for other users.`,
  },
  {
    title: '5. Intellectual Property',
    content: `All quiz content, questions, explanations, design, and code on AlgoQuizr are the intellectual property of AlgoQuizr and its creator. You may not reproduce, distribute, or create derivative works from any content on this platform without explicit written permission. You retain ownership of any data you submit (such as your quiz responses), but grant us a licence to use it to improve the platform.`,
  },
  {
    title: '6. Privacy',
    content: `Your use of AlgoQuizr is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using AlgoQuizr, you consent to the data practices described in the Privacy Policy.`,
  },
  {
    title: '7. Disclaimers',
    content: `AlgoQuizr is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or that quiz content is always accurate. The platform is intended as a study aid and does not guarantee success in any interview or examination. Question difficulty ratings and explanations are provided in good faith but may not reflect every interviewer's standards.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the fullest extent permitted by law, AlgoQuizr and its creator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of data, loss of opportunity, or failure to achieve expected interview outcomes.`,
  },
  {
    title: '9. Termination',
    content: `We reserve the right to suspend or terminate your access to AlgoQuizr at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. You may delete your account at any time through the Settings page.`,
  },
  {
    title: '10. Contact',
    content: `If you have any questions about these Terms of Service, please contact us at adityabt24@gmail.com.`,
  },
];

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>

        {/* Back */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', textDecoration: 'none' }}>
          ← Back to home
        </a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 999, padding: '0.25rem 0.85rem',
            fontSize: '0.75rem', fontWeight: 600, color: 'var(--violet)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            Legal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.75,
            marginBottom: '2.5rem', padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Please read these Terms of Service carefully before using AlgoQuizr. These terms govern your access to and use of the platform. By using AlgoQuizr, you agree to be bound by these terms.
        </motion.p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + i * 0.04 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: '0.65rem',
              }}>
                {s.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                {s.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <a href="/privacy" style={{ color: 'var(--violet)', fontSize: '0.85rem', fontWeight: 500 }}>
            Privacy Policy →
          </a>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Back to AlgoQuizr
          </a>
        </div>
      </div>
    </div>
  );
}