import { motion } from 'framer-motion';

const LAST_UPDATED = 'June 2026';

const SECTIONS = [
  {
    title: '1. Who We Are',
    content: `AlgoQuizr is a DSA practice platform built and operated by Aditya (adityabt24@gmail.com). When we say "we", "us", or "our" in this policy, we mean AlgoQuizr and its creator. If you have questions about this policy, contact us at adityabt24@gmail.com.`,
  },
  {
    title: '2. What Data We Collect',
    content: `We collect information you provide directly when you create an account: your full name, username, email address, and password (stored as a hashed value — we never store your plain-text password). We also collect data generated through your use of the platform: which quizzes you take, your scores, the topics you've attempted, and the dates of those attempts. We do not collect payment information, phone numbers, or location data.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `We use your data to provide and improve AlgoQuizr. Specifically: your account information is used to authenticate you and personalise your experience; your quiz history is used to display your progress, calculate statistics (average score, streaks, best scores), and unlock badges; your email may be used to send you password reset emails when you request them. We do not use your data for advertising purposes.`,
  },
  {
    title: '4. Data Storage and Security',
    content: `Your data is stored in MongoDB Atlas, a cloud database service. Passwords are hashed using bcrypt before storage — even we cannot read your password. Authentication tokens (JWTs) are stored in your browser's local storage and expire after a defined period. We take reasonable technical measures to protect your data, but no system is completely secure and we cannot guarantee absolute security.`,
  },
  {
    title: '5. Cookies and Local Storage',
    content: `AlgoQuizr uses browser local storage (not cookies) to store your authentication token and user information. This data stays on your device and is used solely to keep you logged in between sessions. We do not use third-party tracking cookies or advertising cookies.`,
  },
  {
    title: '6. Third-Party Services',
    content: `AlgoQuizr uses the following third-party services: MongoDB Atlas (database hosting), Render (backend hosting), Vercel (frontend hosting), and Resend (transactional email for password resets). Each of these providers has their own privacy policy governing how they handle data. We share only the minimum data necessary with each provider to operate the platform.`,
  },
  {
    title: '7. Data Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We do not share your data with advertisers. Your data may only be disclosed if required by law, or to protect the rights, property, or safety of AlgoQuizr, its users, or others.`,
  },
  {
    title: '8. Your Rights',
    content: `You have the right to access the data we hold about you, correct inaccurate information (via the Settings page), and delete your account and associated data (via the Settings page). If you'd like a copy of your data or have a request we haven't addressed, contact us at adityabt24@gmail.com and we'll respond within a reasonable timeframe.`,
  },
  {
    title: '9. Data Retention',
    content: `We retain your account and quiz data for as long as your account is active. If you delete your account, we will remove your personal information and quiz history from our database. Some anonymised, non-identifiable aggregate data (such as overall quiz completion rates) may be retained for platform analytics.`,
  },
  {
    title: '10. Children\'s Privacy',
    content: `AlgoQuizr is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it promptly.`,
  },
  {
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. For significant changes, we'll make reasonable efforts to notify you. Continued use of AlgoQuizr after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at adityabt24@gmail.com. We aim to respond to all privacy-related enquiries within 7 business days.`,
  },
];

export default function Privacy() {
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
            Privacy Policy
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
          Your privacy matters to us. This policy explains what data AlgoQuizr collects, how we use it, and what rights you have over it. We've written this to be straightforward and readable — no legal jargon where we can avoid it.
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
          <a href="/terms" style={{ color: 'var(--violet)', fontSize: '0.85rem', fontWeight: 500 }}>
            Terms of Service →
          </a>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Back to AlgoQuizr
          </a>
        </div>
      </div>
    </div>
  );
}