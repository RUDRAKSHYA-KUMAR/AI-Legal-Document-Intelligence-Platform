import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ChevronDown } from 'lucide-react'
import { documentsAPI, summaryAPI } from '../services/api'
import SummaryCard from '../components/SummaryCard'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
export default function Summary() {
  const { state } = useLocation()
  const [documents, setDocuments]   = useState([])
  const [selectedDoc, setSelectedDoc] = useState(state?.document || null)
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading]         = useState(false)
  const [fetching, setFetching]       = useState(true)
  useEffect(() => {
    fetchDocs()
  }, [])
  const fetchDocs = async () => {
    setFetching(true)
    try {
      const result = await documentsAPI.getAll()
      setDocuments(result?.data || [])
    } catch { setDocuments([]) }
    finally { setFetching(false) }
  }
  const handleGenerate = async () => {
    if (!selectedDoc) { toast.error('Please select a document.'); return }
    setLoading(true)
    setSummaryData(null)
    try {
      const result = await summaryAPI.generate(selectedDoc.id ?? selectedDoc.document_id)
      setSummaryData(result?.data || result)
      toast.success('Summary generated!')
    } catch (err) {
      toast.error(err.message || 'Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }
  if (fetching) return <Loading message="Loading documents…" />
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          Document Summary
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Generate an AI-powered overview of any uploaded legal document.
        </p>
      </motion.div>
      {/* Document Selector + Generate */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem 1.5rem' }}
      >
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Select Document
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <select
              value={selectedDoc?.id || selectedDoc?.document_id || ''}
              onChange={e => {
                const doc = documents.find(d => d.id === Number(e.target.value))
                setSelectedDoc(doc || null)
                setSummaryData(null)
              }}
              style={{
                width: '100%', background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#f1f5f9', padding: '0.625rem 2rem 0.625rem 0.875rem',
                fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="">— Choose a document —</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.filename}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!selectedDoc || loading}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: 8,
              background: selectedDoc && !loading ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.05)',
              color: selectedDoc && !loading ? '#fff' : '#475569',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: selectedDoc && !loading ? 'pointer' : 'not-allowed',
              border: 'none', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={15} />
            {loading ? 'Generating…' : 'Generate Summary'}
          </button>
        </div>
      </motion.div>
      {/* Loading State */}
      {loading && <Loading message="Analyzing document with Gemini AI…" inline />}
      {/* Result */}
      {!loading && summaryData && (
        <SummaryCard
          data={summaryData}
          filename={selectedDoc?.filename}
        />
      )}
      {/* Empty Prompt */}
      {!loading && !summaryData && (
        <div style={{
          background: '#0d1425', border: '1px dashed rgba(255,255,255,0.06)',
          borderRadius: 14, padding: '3rem 2rem', textAlign: 'center',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <FileText size={26} color="#6366f1" />
          </div>
          <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>No summary yet</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Select a document above and click Generate Summary.</p>
        </div>
      )}
    </div>
  )
}