/**
 * DocumentCard.jsx
 * Card for a single document with actions
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Trash2, FileSearch, Shield,
  BookOpen, MessageSquare, Download, Clock,
} from 'lucide-react'
import { documentsAPI } from '../services/api'
import toast from 'react-hot-toast'
function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
const ACTIONS = [
  { key: 'summary',  icon: FileText,      label: 'Summarize',  color: '#6366f1' },
  { key: 'contract', icon: Shield,         label: 'Risk',       color: '#f59e0b' },
  { key: 'clause',   icon: BookOpen,       label: 'Clauses',    color: '#06b6d4' },
  { key: 'chat',     icon: MessageSquare,  label: 'Chat',       color: '#10b981' },
]
export default function DocumentCard({ document, onDelete, onAnalyze }) {
  const [deleting, setDeleting] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm(`Delete "${document.filename}"?`)) return
    setDeleting(true)
    try {
      await documentsAPI.delete(document.id)
      toast.success('Document deleted.')
      onDelete?.(document.id)
    } catch (err) {
      toast.error(err.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }
  const handleDownload = (e) => {
    e.stopPropagation()
    window.open(documentsAPI.downloadUrl(document.id), '_blank')
  }
  return (
    <motion.div
      className="document-card"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <FileText size={18} color="#6366f1" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontWeight: 700, color: 'var(--text-primary)',
            fontSize: '0.875rem', marginBottom: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
            title={document.filename}
          >
            {document.filename}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatSize(document.file_size)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Clock size={11} />
              {formatDate(document.uploaded_at)}
            </span>
          </div>
        </div>
      </div>
      {/* ID Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="tag" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}>
          ID #{document.id}
        </span>
      </div>
      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
        {ACTIONS.map(({ key, icon: Icon, label, color }) => (
          <button
            key={key}
            onClick={(e) => { e.stopPropagation(); onAnalyze?.(document, key) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 0.625rem',
              background: `${color}10`,
              border: `1px solid ${color}22`,
              borderRadius: 8,
              color, fontSize: '0.775rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}22` }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}10` }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
      {/* Footer: download + delete */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button
          className="btn-icon"
          onClick={handleDownload}
          title="Download PDF"
          style={{ padding: '0.375rem' }}
        >
          <Download size={14} />
        </button>
        <button
          className="btn-icon"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete document"
          style={{
            padding: '0.375rem',
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.15)',
            color: '#f43f5e',
          }}
        >
          {deleting
            ? <div className="spinner spinner-sm" style={{ borderTopColor: '#f43f5e' }} />
            : <Trash2 size={14} />}
        </button>
      </div>
    </motion.div>
  )
}
