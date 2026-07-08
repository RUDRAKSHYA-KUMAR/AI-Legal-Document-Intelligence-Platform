import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Server, Palette, Bell, Info, Check } from 'lucide-react'
import toast from 'react-hot-toast'
const SECTION = ({ title, icon: Icon, children }) => (
  <div style={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon size={16} color="#818cf8" />
      <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f1f5f9' }}>{title}</p>
    </div>
    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
  </div>
)
const FIELD = ({ label, hint, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>{hint}</p>}
  </div>
)
const INPUT_STYLE = {
  width: '100%', background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, color: '#f1f5f9', padding: '0.625rem 0.875rem',
  fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
}
export default function Settings() {
  const [backendUrl, setBackendUrl]       = useState(import.meta.env.VITE_API_URL || 'http://localhost:8000')
  const [theme, setTheme]                 = useState('dark')
  const [notifications, setNotifications] = useState(true)
  const [saving, setSaving]               = useState(false)
  const handleSave = async () => {
    setSaving(true)
    // Persist to localStorage for frontend use
    localStorage.setItem('lexai_backend_url', backendUrl)
    localStorage.setItem('lexai_theme', theme)
    localStorage.setItem('lexai_notifications', notifications)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    toast.success('Settings saved successfully!')
  }
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          Settings
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Configure your LexAI preferences and API connection.</p>
      </motion.div>
      {/* Backend Config */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SECTION title="Backend Connection" icon={Server}>
          <FIELD label="API Base URL" hint="The FastAPI backend URL. Default: http://localhost:8000">
            <input
              value={backendUrl}
              onChange={e => setBackendUrl(e.target.value)}
              placeholder="http://localhost:8000"
              style={INPUT_STYLE}
            />
          </FIELD>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={async () => {
                try {
                  const r = await fetch(backendUrl + '/')
                  if (r.ok) toast.success('Backend is reachable! ✓')
                  else toast.error(`Backend returned ${r.status}`)
                } catch {
                  toast.error('Cannot reach backend. Is it running?')
                }
              }}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                color: '#10b981', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Test Connection
            </button>
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>Checks if the backend is reachable</span>
          </div>
        </SECTION>
      </motion.div>
      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SECTION title="Appearance" icon={Palette}>
          <FIELD label="Theme">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['dark', 'darker'].map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                    background: theme === t ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    color: theme === t ? '#818cf8' : '#64748b',
                    border: `1px solid ${theme === t ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {theme === t && <Check size={12} />} {t}
                </button>
              ))}
            </div>
          </FIELD>
        </SECTION>
      </motion.div>
      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SECTION title="Notifications" icon={Bell}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>Toast Notifications</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Show success/error toasts for API actions</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: notifications ? '#6366f1' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: notifications ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </SECTION>
      </motion.div>
      {/* About */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <SECTION title="About" icon={Info}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              ['Project',    'AI Legal Document Intelligence Platform'],
              ['Frontend',   'React 19 + Vite + Framer Motion'],
              ['Backend',    'FastAPI + Gemini AI + ChromaDB'],
              ['Version',    '1.0.0'],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', alignItems: 'center' }}>
                <span style={{ color: '#475569', minWidth: 80, fontWeight: 600 }}>{key}</span>
                <span style={{ color: '#94a3b8' }}>{val}</span>
              </div>
            ))}
          </div>
        </SECTION>
      </motion.div>
      {/* Save */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.75rem 2rem', borderRadius: 10,
            background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: '#fff', fontSize: '0.9375rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            border: 'none', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}
        >
          <SettingsIcon size={16} />
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </motion.div>
    </div>
  )
}
