import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/dashboard/Sidebar";
import {
  MdOutlinePerson, MdOutlineEmail, MdLockOutline,
  MdVisibility, MdVisibilityOff, MdOutlineNotifications,
  MdOutlineAccountCircle, MdOutlinePalette, MdOutlineBadge,
} from "react-icons/md";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../hooks/useAuth";

const ACCENT_COLORS = [
  { label: "Violet",  value: "#8b5cf6" },
  { label: "Cyan",    value: "#22d3ee" },
  { label: "Rose",    value: "#f43f5e" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Emerald", value: "#10b981" },
];

const NOTIF_KEY   = "algoquizr_notif";
const THEME_KEY   = "algoquizr_theme";
const ACCENT_KEY  = "algoquizr_accent";

// ─── Helper components ────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, icon: Icon, children, delay = 0 }: {
  title: string; subtitle: string; icon: React.ElementType;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: "var(--bg-surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "0.75rem",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "var(--radius-sm)",
          background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={17} color="var(--violet)" />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem" }}>{title}</p>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </motion.div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, icon: Icon, rightSlot, disabled }: {
  label: string; type?: string; value: string;
  onChange?: (v: string) => void; placeholder?: string;
  icon: React.ElementType; rightSlot?: React.ReactNode; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-secondary)" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <Icon size={16} style={{
          position: "absolute", left: 13, top: "50%",
          transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
        }} />
        <input
          type={type} value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder} disabled={disabled}
          style={{
            width: "100%", padding: "0.7rem 1rem 0.7rem 2.4rem",
            paddingRight: rightSlot ? "2.75rem" : "1rem",
            background: disabled ? "rgba(255,255,255,0.02)" : "var(--bg-elevated)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            color: disabled ? "var(--text-muted)" : "var(--text-primary)",
            fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s",
            fontFamily: "var(--font-body)", cursor: disabled ? "not-allowed" : "text",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; }}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 42, height: 24, borderRadius: 999,
        background: enabled ? "var(--violet)" : "var(--bg-elevated)",
        border: `1px solid ${enabled ? "var(--violet)" : "var(--border)"}`,
        position: "relative", cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: enabled ? 22 : 3, transition: "left 0.2s",
      }} />
    </button>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto", paddingTop: "1.25rem" }}>
      <motion.button
        whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
          padding: "0.6rem 1.5rem", borderRadius: "var(--radius-sm)",
          background: saved ? "rgba(34,197,94,0.15)" : "var(--violet)",
          border: saved ? "1px solid rgba(34,197,94,0.3)" : "none",
          color: saved ? "#4ade80" : "#fff", fontSize: "0.88rem",
          fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
          transition: "all 0.25s", minWidth: 90,
        }}
      >
        {saved ? "✓ Saved" : "Save"}
      </motion.button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  if (dark) {
    document.documentElement.style.setProperty("--bg", "#07080f");
    document.documentElement.style.setProperty("--bg-surface", "#0d0f1a");
    document.documentElement.style.setProperty("--bg-elevated", "#13162a");
    document.documentElement.style.setProperty("--text-primary", "#f0f0f5");
    document.documentElement.style.setProperty("--text-secondary", "#8b8fa8");
    document.documentElement.style.setProperty("--text-muted", "#555878");
    document.documentElement.style.setProperty("--border", "rgba(255,255,255,0.07)");
  } else {
    document.documentElement.style.setProperty("--bg", "#f4f4f8");
    document.documentElement.style.setProperty("--bg-surface", "#ffffff");
    document.documentElement.style.setProperty("--bg-elevated", "#f0f0f5");
    document.documentElement.style.setProperty("--text-primary", "#0d0f1a");
    document.documentElement.style.setProperty("--text-secondary", "#4a4d66");
    document.documentElement.style.setProperty("--text-muted", "#9191a8");
    document.documentElement.style.setProperty("--border", "rgba(0,0,0,0.09)");
  }
}

function applyAccent(color: string) {
  document.documentElement.style.setProperty("--violet", color);
  document.documentElement.style.setProperty("--border-accent", color + "55");
  document.documentElement.style.setProperty("--violet-dim", color + "18");
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Settings() {
  const { token, user, login } = useAuth();

  // Profile
  const [name, setName]               = useState("");
  const [username, setUsername]       = useState("");
  const [email, setEmail]             = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setUsername(user.username ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleProfileSave = async () => {
    setProfileError("");
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, username, email }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.message ?? "Failed to save"); return; }
      login(token!, { ...user!, name: data.name, username: data.username, email: data.email });
      triggerSaved(setProfileSaved);
    } catch { setProfileError("Network error"); }
  };

  // Password
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passSaved, setPassSaved]     = useState(false);
  const [passError, setPassError]     = useState("");

  const handlePasswordSave = async () => {
    setPassError("");
    if (!currentPass || !newPass || !confirmPass) { setPassError("Please fill all fields."); return; }
    if (newPass.length < 8) { setPassError("New password must be at least 8 characters."); return; }
    if (newPass !== confirmPass) { setPassError("Passwords do not match."); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/users/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) { setPassError(data.message ?? "Failed to update password"); return; }
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
      triggerSaved(setPassSaved);
    } catch { setPassError("Network error"); }
  };

  // Notifications — persisted in localStorage
  const [notifyQuizReminder, setNotifyQuizReminder] = useState(() => {
    const s = localStorage.getItem(NOTIF_KEY);
    return s ? JSON.parse(s).quizReminder ?? true : true;
  });
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(() => {
    const s = localStorage.getItem(NOTIF_KEY);
    return s ? JSON.parse(s).weeklyReport ?? false : false;
  });
  const [notifyTips, setNotifyTips] = useState(() => {
    const s = localStorage.getItem(NOTIF_KEY);
    return s ? JSON.parse(s).tips ?? true : true;
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const handleNotifSave = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify({
      quizReminder: notifyQuizReminder,
      weeklyReport: notifyWeeklyReport,
      tips: notifyTips,
    }));
    triggerSaved(setPrefSaved);
  };

  // Appearance — persisted in localStorage, applied to DOM
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) !== "light";
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem(ACCENT_KEY) ?? "#8b5cf6";
  });
  const [appearSaved, setAppearSaved] = useState(false);

  // Apply on mount
  useEffect(() => { applyTheme(darkMode); }, []);
  useEffect(() => { applyAccent(accentColor); }, []);

  const handleDarkModeChange = (val: boolean) => {
    setDarkMode(val);
    applyTheme(val);
  };

  const handleAccentChange = (val: string) => {
    setAccentColor(val);
    applyAccent(val);
  };

  const handleAppearSave = () => {
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    localStorage.setItem(ACCENT_KEY, accentColor);
    triggerSaved(setAppearSaved);
  };

  const triggerSaved = (setSaved: (v: boolean) => void) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ flex: 1, padding: "clamp(1.5rem, 4vw, 2.5rem)", overflowY: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} style={{ marginBottom: "2rem" }}
        >
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>
            Settings
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage your account, appearance, and preferences.
          </p>
        </motion.div>

        <div className="settings-grid" style={{ maxWidth: 1100, display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>

          {/* Profile */}
          <SectionCard title="Profile & Account Info" subtitle="Update your details and view your account info." icon={MdOutlineAccountCircle} delay={0.04}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <InputField label="Full name" value={name} onChange={setName} placeholder="Your name" icon={MdOutlinePerson} />
              <InputField label="Username" value={username} onChange={setUsername} placeholder="Your username" icon={MdOutlineBadge} />
              <InputField label="Email" value={email} onChange={setEmail} placeholder="you@example.com" icon={MdOutlineEmail} type="email" />
              <InputField label="Member since" value={joinedDate} icon={MdOutlinePerson} disabled />
              <InputField label="Plan" value={user?.plan ?? "—"} icon={MdOutlinePerson} disabled />
            </div>
            {profileError && <p style={{ fontSize: "0.8rem", color: "#f87171", marginTop: "0.75rem" }}>{profileError}</p>}
            <SaveButton onClick={handleProfileSave} saved={profileSaved} />
          </SectionCard>

          {/* Password */}
          <SectionCard title="Change Password" subtitle="Use a strong password of at least 8 characters." icon={MdLockOutline} delay={0.12}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Current password", val: currentPass, set: setCurrentPass, show: showCurrent, setShow: setShowCurrent },
                { label: "New password",     val: newPass,     set: setNewPass,     show: showNew,     setShow: setShowNew },
                { label: "Confirm new password", val: confirmPass, set: setConfirmPass, show: showConfirm, setShow: setShowConfirm },
              ].map(({ label, val, set, show, setShow }) => (
                <InputField key={label} label={label} type={show ? "text" : "password"}
                  value={val} onChange={set} placeholder="••••••••" icon={MdLockOutline}
                  rightSlot={
                    <button onClick={() => setShow((p: boolean) => !p)}
                      style={{ color: "var(--text-muted)", lineHeight: 0, background: "none", border: "none", cursor: "pointer" }}>
                      {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                    </button>
                  }
                />
              ))}
              {passError && <p style={{ fontSize: "0.8rem", color: "#f87171" }}>{passError}</p>}
            </div>
            <SaveButton onClick={handlePasswordSave} saved={passSaved} />
          </SectionCard>

          {/* Appearance */}
          <SectionCard title="Appearance" subtitle="Customise how AlgoQuizr looks for you." icon={MdOutlinePalette} delay={0.16}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem" }}>Dark mode</p>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Switch between dark and light theme.</p>
                </div>
                <Toggle enabled={darkMode} onChange={handleDarkModeChange} />
              </div>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Accent colour</p>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {ACCENT_COLORS.map((c) => (
                    <button key={c.value} title={c.label} onClick={() => handleAccentChange(c.value)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", background: c.value,
                        border: accentColor === c.value ? "3px solid #fff" : "3px solid transparent",
                        outline: accentColor === c.value ? `2px solid ${c.value}` : "none",
                        cursor: "pointer", transition: "all 0.18s",
                        boxShadow: accentColor === c.value ? `0 0 10px ${c.value}80` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <SaveButton onClick={handleAppearSave} saved={appearSaved} />
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notifications" subtitle="Choose what emails you want to receive." icon={MdOutlineNotifications} delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {[
                { label: "Quiz reminders",  sub: "Remind me to practice if I haven't in 2 days.", value: notifyQuizReminder, set: setNotifyQuizReminder },
                { label: "Weekly report",   sub: "Get a summary of your progress every week.",     value: notifyWeeklyReport, set: setNotifyWeeklyReport },
                { label: "Tips & resources",sub: "Occasional DSA tips and study resources.",        value: notifyTips,         set: setNotifyTips },
              ].map(({ label, sub, value, set }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{label}</p>
                    <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{sub}</p>
                  </div>
                  <Toggle enabled={value} onChange={set} />
                </div>
              ))}
            </div>
            <SaveButton onClick={handleNotifSave} saved={prefSaved} />
          </SectionCard>

        </div>
      </main>
      <style>{`
        @media (max-width: 767px) { .dashboard-main { padding-top: 72px !important; } }
        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}