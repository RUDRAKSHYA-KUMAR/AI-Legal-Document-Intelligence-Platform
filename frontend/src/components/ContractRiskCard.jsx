/**
 * ContractRiskCard.jsx
 * Displays full contract analysis: type, parties, dates, risks, obligations
 */
import { motion } from 'framer-motion'
import { Shield, Users, Calendar, Scale, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react'
function RiskBadge({ level }) {
  const normalized = (level || '').toLowerCase()
  const cls =
    normalized.includes('high')   ? 'risk-high'    :
    normalized.includes('medium') ? 'risk-medium'  :
    normalized.includes('low')    ? 'risk-low'      : 'risk-unknown'
  return (
    <span className={`risk-badge ${cls}`}>
      {normalized.includes('high')   && <AlertTriangle size={10} />}
      {normalized.includes('medium') && <AlertTriangle size={10} />}
      {normalized.includes('low')    && <CheckCircle   size={10} />}
      {level || 'Unknown'}
    </span>
  )
}
function InfoRow({ icon: Icon, label, value, color = 'var(--brand-primary)' }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${color}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>
        <Icon size={14} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>
    </div>
  )
}
export default function ContractRiskCard({ data, filename }) {
  if (!data) return null
  const risks       = data.legal_risks             || []
  const obligations = data.important_obligations   || []
  const deadlines   = data.key_deadlines           || []
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Overview grid */}
      <div className="grid-2" style={{ gap: '0.75rem' }}>
        <InfoRow icon={Scale}    label="Contract Type"    value={data.contract_type}    color="#6366f1" />
        <InfoRow icon={Scale}    label="Governing Law"    value={data.governing_law}    color="#8b5cf6" />
        <InfoRow icon={Calendar} label="Effective Date"   value={data.effective_date}   color="#06b6d4" />
        <InfoRow icon={Calendar} label="Expiration Date"  value={data.expiration_date}  color="#f59e0b" />
        <InfoRow icon={Users}    label="Parties Involved" value={data.parties}          color="#10b981" />
        <InfoRow icon={Info}     label="Main Purpose"     value={data.main_purpose}     color="#818cf8" />
      </div>
      <div className="divider" />
      {/* Key Obligations */}
      {obligations.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Key Obligations
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {obligations.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}
              >
                <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Key Deadlines */}
      {deadlines.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Key Deadlines
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {deadlines.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.375rem 0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 8 }}>
                <Clock size={12} color="#f59e0b" />
                <span style={{ fontSize: '0.8125rem', color: '#f59e0b', fontWeight: 500 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Legal Risks */}
      {risks.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Legal Risks
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {risks.map((risk, i) => (
              <motion.div
                key={i}
                className="risk-item"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={14} color="#f43f5e" />
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                    {typeof risk === 'string' ? risk : risk.title || `Risk ${i + 1}`}
                  </p>
                  {typeof risk === 'object' && risk.severity && (
                    <RiskBadge level={risk.severity} />
                  )}
                </div>
                {typeof risk === 'object' && risk.reason && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    {risk.reason}
                  </p>
                )}
                {typeof risk === 'object' && risk.recommendation && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.5rem 0.625rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 6 }}>
                    <CheckCircle size={12} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: '0.8rem', color: '#10b981', lineHeight: 1.5 }}>
                      {risk.recommendation}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {risks.length === 0 && obligations.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
          <CheckCircle size={18} color="#10b981" />
          <p style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 500 }}>
            No major risks detected in this contract.
          </p>
        </div>
      )}
    </motion.div>
  )
}
