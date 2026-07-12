/**
 * Navbar.jsx
 * Top bar with page title and status badge
 */
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
const PAGE_TITLES = {
  '/dashboard':         { title: 'Dashboard',         emoji: '🏠' },
  '/upload':            { title: 'Upload Document',   emoji: '📄' },
  '/summary':           { title: 'AI Summarizer',     emoji: '✨' },
  '/contract-analysis': { title: 'Contract Risk Analysis', emoji: '🛡️' },
  '/clause-explainer':  { title: 'Clause Explainer',  emoji: '📖' },
  '/chat':              { title: 'Chat with Document','emoji': '💬' },
  '/settings':          { title: 'Settings',          emoji: '⚙️' },
}
export default function Navbar() {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'LEGAL-LENS', emoji: '⚖️' }
  return (
    <header className="navbar">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="navbar-title"
      >
        <span style={{ marginRight: '0.5rem' }}>{page.emoji}</span>
        {page.title}
      </motion.div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Gemini badge */}
        <div className="navbar-badge">
          <Zap size={12} />
          Gemini AI
        </div>
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 800,
          color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 0 0 2px rgba(99,102,241,0.25)',
        }}>
          S
        </div>
      </div>
    </header>
  )
}
