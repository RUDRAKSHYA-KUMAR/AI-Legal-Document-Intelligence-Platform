/**
 * ClauseCard.jsx
 * Individual clause display with title, description, importance, and risk badge
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'
function RiskBadge({ level }) {
  const normalized = (level || '').toLowerCase()
  const cls =
    normalized.includes('high')   ? 'risk-high'   :
    normalized.includes('medium') ? 'risk-medium' :
    normalized.includes('low')    ? 'risk-low'    : 'risk-unknown'
  const Icon =
    normalized.includes('high') || normalized.includes('medium') ? AlertTriangle :
    normalized.includes('low')  ? CheckCircle : Info
  return (
    <span className={`risk-badge ${cls}`}>
      <Icon size={10} />
      {level || 'Unknown'}
    </span>
  )
}
export default function ClauseCard({ clause, index }) {
  const [expanded, setExpanded] = useState(false)
  const title       = clause.title       || `Clause ${index + 1}`
  const description = clause.description || ''
  const importance  = clause.importance  || ''
  const riskLevel   = clause.risk_level  || ''
  return (
    <motion.div
      className="clause-card"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      {/* Header Row */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        onClick={() => setExpanded(prev => !prev)}
      >
        {/* Icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'rgba(6,182,212,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BookOpen size={15} color="#06b6d4" />
        </div>
        {/* Title + number */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6,
              background: 'rgba(99,102,241,0.12)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-secondary)',
              flexShrink: 0,
            }}>
              {index + 1}
            </span>
            <p style={{
              fontWeight: 700, color: 'var(--text-primary)',
              fontSize: '0.9rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {title}
            </p>
          </div>
        </div>
        {/* Risk + expand toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <RiskBadge level={riskLevel} />
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} color="var(--text-muted)" />
          </motion.div>
        </div>
      </div>
      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '0.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
              {/* Description */}
              {description && (
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                    Description
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {description}
                  </p>
                </div>
              )}
              {/* Importance */}
              {importance && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.625rem 0.75rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 8 }}>
                  <Info size={14} color="#818cf8" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Why it matters</p>
                    <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {importance}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
