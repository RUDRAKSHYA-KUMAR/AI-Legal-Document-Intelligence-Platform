/**
 * Sidebar.jsx
 * Collapsible left navigation with LEGAL-LENS branding
 */
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Upload, FileText, Shield,
  BookOpen, MessageSquare, Settings, Scale,
} from 'lucide-react'
const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/upload',           icon: Upload,          label: 'Upload' },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { to: '/summary',          icon: FileText,        label: 'Summarizer' },
      { to: '/contract-analysis',icon: Shield,          label: 'Contract Risk' },
      { to: '/clause-explainer', icon: BookOpen,        label: 'Clause Explainer' },
      { to: '/chat',             icon: MessageSquare,   label: 'Chat with Doc' },
    ],
  },
  {
    section: 'System',
    items: [
      { to: '/settings',         icon: Settings,        label: 'Settings' },
    ],
  },
]
export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon animate-glow">
          <Scale size={18} color="#fff" />
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">LEGAL-LENS</div>
          <div className="sidebar-brand-tagline">Legal AI Platform</div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div className="sidebar-section-label">{section}</div>
            {items.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to
              return (
                <NavLink
                  key={to}
                  to={to}
                  className="nav-item"
                  style={({ isActive: active }) => ({
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: active ? 'var(--brand-secondary)' : 'var(--text-secondary)',
                    borderColor: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                  })}
                >
                  {({ isActive: active }) => (
                    <>
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            className="nav-item-indicator"
                            layoutId="nav-indicator"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>
                      <Icon
                        size={17}
                        className="nav-icon"
                        color={active ? 'var(--brand-primary)' : 'currentColor'}
                      />
                      <span className="nav-label">{label}</span>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: 'var(--brand-primary)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-dot" />
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Backend Connected
            </p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              localhost:8000
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
