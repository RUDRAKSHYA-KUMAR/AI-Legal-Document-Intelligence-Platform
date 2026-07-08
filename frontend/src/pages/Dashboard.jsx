import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, Upload, Shield, MessageSquare,
  BookOpen, TrendingUp, Clock, Zap, ArrowRight,
} from 'lucide-react'
import { documentsAPI } from '../services/api'
import DocumentCard from '../components/DocumentCard'
import Loading from '../components/Loading'
const STATS = [
  { label: 'Documents',      icon: FileText,     color: '#6366f1', bgColor: 'rgba(99,102,241,0.12)',  key: 'total' },
  { label: 'Analyses Run',   icon: TrendingUp,   color: '#10b981', bgColor: 'rgba(16,185,129,0.12)', key: 'analyses' },
  { label: 'Clauses Found',  icon: BookOpen,     color: '#06b6d4', bgColor: 'rgba(6,182,212,0.12)',  key: 'clauses' },
  { label: 'Avg. Risk Score',icon: Shield,       color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)', key: 'risk' },
]
const QUICK_ACTIONS = [
  { to: '/upload',            icon: Upload,        label: 'Upload New',     color: '#6366f1', desc: 'Add a PDF document' },
  { to: '/summary',          icon: FileText,      label: 'Summarize',      color: '#10b981', desc: 'Generate AI summary' },
  { to: '/contract-analysis', icon: Shield,       label: 'Analyze Risk',   color: '#f59e0b', desc: 'Contract risk check' },
  { to: '/chat',              icon: MessageSquare, label: 'Chat with Doc', color: '#06b6d4', desc: 'Ask AI questions' },
]
export default function Dashboard() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading]     = useState(true)
  useEffect(() => {
    fetchDocuments()
  }, [])
  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const result = await documentsAPI.getAll()
      setDocuments(result?.data || [])
    } catch {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = (id) => setDocuments(prev => prev.filter(d => d.id !== id))
  const handleAnalyze = (doc, action) => {
    const routes = {
      summary:  '/summary',
      contract: '/contract-analysis',
      clause:   '/clause-explainer',
      chat:     '/chat',
    }
    navigate(routes[action] || '/dashboard', { state: { document: doc } })
  }
  const stats = [
    { ...STATS[0], value: documents.length },
    { ...STATS[1], value: documents.length * 2 },
    { ...STATS[2], value: documents.length * 4 },
    { ...STATS[3], value: 'Medium' },
  ]
  if (loading) return <Loading message="Loading your documents…" />
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── Welcome ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#f1f5f9', marginBottom: 6 }}>
          Welcome back 👋
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {documents.length
            ? `You have ${documents.length} document${documents.length !== 1 ? 's' : ''} ready for analysis.`
            : 'Get started by uploading your first legal document.'}
        </p>
      </motion.div>
      {/* ── Stats ── */}
      <div className="grid-4">
        {stats.map(({ label, icon: Icon, color, bgColor, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500, marginTop: 4 }}>{label}</div>
          </motion.div>
        ))}
      </div>
      {/* ── Quick Actions ── */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Quick Actions</h3>
        <div className="grid-4">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, color, desc }, i) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color, fontSize: '0.75rem', fontWeight: 600 }}>
                Open <ArrowRight size={12} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      {/* ── Recent Documents ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="#6366f1" /> Recent Documents
          </h3>
          {documents.length > 4 && (
            <button onClick={() => navigate('/upload')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              View all
            </button>
          )}
        </div>
        {documents.length === 0 ? (
          <div style={{
            background: '#0d1425', border: '2px dashed rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '3rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={28} color="#6366f1" />
            </div>
            <p style={{ fontWeight: 600, color: '#94a3b8' }}>No documents yet</p>
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Upload your first legal document to get started.</p>
            <button
              onClick={() => navigate('/upload')}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: 8,
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', border: 'none',
              }}
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {documents.slice(0, 6).map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDelete}
                onAnalyze={handleAnalyze}
              />
            ))}
          </div>
        )}
      </div>
      {/* ── AI Powered By Banner ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.06))',
          border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14,
          padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} color="#818cf8" />
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Powered by Gemini AI + RAG</p>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Legal documents are analyzed using Google Gemini with Retrieval-Augmented Generation for accurate, context-aware answers.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
