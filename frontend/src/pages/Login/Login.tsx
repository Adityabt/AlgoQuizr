import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdOutlineEmail, MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch {
      setError('Could not reach the server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2rem, 6vw, 2.75rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem' }}>
          <img src="/AQLogo.png" alt="AlgoQuizr" style={{ width: 32, height: 32 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginLeft: '0.4rem' }}>
            Algo<span style={{ fontWeight: 300, opacity: 0.6 }}>Quizr</span>
          </span>
        </a>

        {/* Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: 'var(--violet)', fontWeight: 500 }}>Sign up</a>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <MdOutlineEmail
                size={17}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="abc@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <a href="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--violet)' }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <MdLockOutline
                size={17}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 2.75rem 0.7rem 2.5rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  padding: 0,
                  lineHeight: 0,
                }}
              >
                {showPass ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: '0.82rem', color: '#f87171', marginTop: '-0.25rem' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-body)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}