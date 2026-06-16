import { useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineEmail } from "react-icons/md";
import { API_BASE_URL } from "../../config/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true); // Always show success (don't leak if email exists)
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
        }}
      >
        <a
          href="/login"
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            display: "inline-block",
          }}
        >
          ← Back to login
        </a>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}
        >
          Reset password
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          {sent
            ? "If an account exists for that email, you'll receive a reset link shortly."
            : "Enter your email and we'll send you a reset link."}
        </p>

        {!sent && (
          <>
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
              <MdOutlineEmail
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {error && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#f87171",
                  marginBottom: "0.75rem",
                }}
              >
                {error}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "var(--violet)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "var(--font-body)",
              }}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}

        {sent && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "var(--radius-sm)",
              color: "#4ade80",
              fontSize: "0.88rem",
              textAlign: "center",
            }}
          >
            ✓ Check your inbox
          </div>
        )}
      </motion.div>
    </div>
  );
}
