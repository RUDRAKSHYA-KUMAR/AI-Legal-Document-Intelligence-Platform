/**
 * Loading.jsx
 * Reusable loading state component with spinner or inline pulse
 */
export default function Loading({ message = 'Loading…', inline = false }) {
  if (inline) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1.25rem 1.5rem',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: '12px',
      }}>
        <div className="loading-pulse">
          <span /><span /><span />
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {message}
        </p>
      </div>
    )
  }
  return (
    <div className="loading-overlay">
      {/* Animated logo mark */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'glow-pulse 3s ease-in-out infinite',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 8h6M9 16h4" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 4h16v16H4z" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="spinner" style={{ position: 'absolute', inset: -6, width: 76, height: 76, borderRadius: '50%' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', marginBottom: 4 }}>
          {message}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Powered by Gemini AI
        </p>
      </div>
    </div>
  )
}
