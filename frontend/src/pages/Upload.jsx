import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, Info, CheckCircle, FileText } from 'lucide-react'
import UploadCard from '../components/UploadCard'
import { useNavigate } from 'react-router-dom'
const TIPS = [
  'Only PDF files are supported (max 10 MB).',
  'Once uploaded the document is automatically indexed for AI analysis.',
  'You can then summarize, analyze risks, extract clauses, or chat with it.',
  'Documents are stored securely on the server.',
]
export default function Upload() {
  const navigate = useNavigate()
  const [uploadedDoc, setUploadedDoc] = useState(null)
  const handleSuccess = (docData) => {
    setUploadedDoc(docData)
  }
  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
          Upload Legal Document
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Import a PDF to begin AI-powered analysis — summarize, detect risks, extract clauses, or chat with it.
        </p>
      </motion.div>
      {/* Upload Zone */}
      <UploadCard onSuccess={handleSuccess} />
      {/* Success Card */}
      {uploadedDoc && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.5rem', background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14,
            padding: '1.25rem 1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckCircle size={22} color="#10b981" />
            <div>
              <p style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9375rem' }}>Document Ready!</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {uploadedDoc.filename} · ID #{uploadedDoc.document_id}
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {[
              { label: 'Summarize',      path: '/summary',           color: '#6366f1' },
              { label: 'Analyze Contract', path: '/contract-analysis', color: '#f59e0b' },
              { label: 'Extract Clauses', path: '/clause-explainer',  color: '#06b6d4' },
              { label: 'Chat with Doc',  path: '/chat',              color: '#10b981' },
            ].map(({ label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path, { state: { document: uploadedDoc } })}
                style={{
                  padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer',
                  background: `${color}12`, border: `1px solid ${color}30`,
                  color, fontSize: '0.8rem', fontWeight: 600,
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}25` }}
                onMouseLeave={e => { e.currentTarget.style.background = `${color}12` }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{
          marginTop: '2rem', background: '#0d1425',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
          <Info size={16} color="#818cf8" />
          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f1f5f9' }}>Upload Guidelines</p>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TIPS.map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8125rem', color: '#94a3b8' }}>
              <span style={{ color: '#6366f1', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
