import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { API_BASE_URL } from '../../config/api';

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [newPass, setNewPass]       = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState('');
  const [done, setDone]             = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!newPass || !confirmPass) { setError('Please fill all fields.'); return; }
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid reset link.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Something went wrong.'); return; }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '2.5rem',
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Set new password
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {done ? 'Your password has been reset successfully.' : 'Enter your new password below.'}
        </p>

        {!done ? (
          <>
            {[
              { label: 'New password',     val: newPass,     set: setNewPass,     show: showNew,     setShow: setShowNew },
              { label: 'Confirm password', val: confirmPass, set: setConfirmPass, show: showConfirm, setShow: setShowConfirm },
            ].map(({ label, val, set, show, setShow }) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <MdLockOutline size={16} style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    type={show ? 'text' : 'password'} value={val}
                    onChange={e => set(e.target.value)} placeholder="••••••••"
                    style={{
                      width: '100%', padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                      fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'var(--font-body)',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <button onClick={() => setShow((p: boolean) => !p)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0,
                  }}>
                    {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                  </button>
                </div>
              </div>
            ))}

            {error && <p style={{ fontSize: '0.8rem', color: '#f87171', marginBottom: '1rem' }}>{error}</p>}

            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '0.75rem',
                background: 'var(--violet)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontWeight: 600, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'var(--font-body)',
              }}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </>
        ) : (
          <>
            <div style={{
              padding: '1rem', background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)',
              color: '#4ade80', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.5rem',
            }}>
              ✓ Password reset successfully
            </div>
            <a href="/login" style={{
              display: 'block', textAlign: 'center', padding: '0.75rem',
              background: 'var(--violet)', color: '#fff', borderRadius: 'var(--radius-sm)',
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
            }}>
              Back to login
            </a>
          </>
        )}
      </motion.div>
    </div>
  );
}