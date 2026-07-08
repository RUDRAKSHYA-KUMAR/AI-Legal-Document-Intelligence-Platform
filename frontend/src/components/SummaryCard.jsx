/**
 * SummaryCard.jsx
 * Displays AI-generated summary and key points
 */
import { motion } from 'framer-motion'
import { FileText, Sparkles, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
export default function SummaryCard({ data, filename }) {
  const [copied, setCopied] = useState(false)
  if (!data) return null
  const summary   = data.summary   || ''
  const keyPoints = data.key_points || []
  const handleCopy = () => {
    const text = [
      `Summary of: ${filename || 'Document'}`,
      '',
      summary,
      '',
      'Key Points:',
      ...keyPoints.map((p, i) => `${i + 1}. ${p}`),
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    })
  }
  return (
    <motion.div
      className="summary-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(99,102,241,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={18} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Document Summary
            </h3>
            {filename && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {filename}
              </p>
            )}
          </div>
        </div>
        <button
          className="btn-icon"
          onClick={handleCopy}
          title="Copy summary"
        >
          {copied ? <CheckCheck size={15} color="#10b981" /> : <Copy size={15} />}
        </button>
      </div>
      {/* Summary Text */}
      <div style={{
        background: 'rgba(99,102,241,0.04)',
        border: '1px solid rgba(99,102,241,0.1)',
        borderRadius: 10,
        padding: '1.125rem',
        marginBottom: '1.25rem',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          padding: '0.2rem 0.5rem',
          background: 'rgba(99,102,241,0.12)',
          borderRadius: 99,
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--brand-secondary)',
        }}>
          <Sparkles size={10} />
          AI Generated
        </div>
        <p style={{
          fontSize: '0.9rem', lineHeight: 1.75,
          color: 'var(--text-secondary)', paddingRight: '4rem',
        }}>
          {summary || 'No summary available.'}
        </p>
      </div>
      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div>
          <p style={{
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem',
          }}>
            Key Points
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {keyPoints.map((point, i) => (
              <motion.div
                key={i}
                className="key-point"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="key-point-num">{i + 1}</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
