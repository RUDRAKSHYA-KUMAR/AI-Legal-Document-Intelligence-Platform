import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ChevronDown } from 'lucide-react'
import { documentsAPI, contractAPI } from '../services/api'
import ContractRiskCard from '../components/ContractRiskCard'
import Loading from '../components/Loading'
import PDFViewer from '../components/PDFViewer'
import toast from 'react-hot-toast'
export default function ContractAnalysis() {
  const { state } = useLocation()
  const [documents, setDocuments]     = useState([])
  const [selectedDoc, setSelectedDoc] = useState(state?.document || null)
  const [riskData, setRiskData]       = useState(null)
  const [loading, setLoading]         = useState(false)
  const [fetching, setFetching]       = useState(true)
  const [showPDF, setShowPDF]         = useState(false)
  useEffect(() => { fetchDocs() }, [])
  const fetchDocs = async () => {
    setFetching(true)
    try {
      const r = await documentsAPI.getAll()
      setDocuments(r?.data || [])
    } catch { setDocuments([]) }
    finally { setFetching(false) }
  }
  const handleAnalyze = async () => {
    if (!selectedDoc) { toast.error('Please select a document.'); return }
    setLoading(true)
    setRiskData(null)
    try {
      const id = selectedDoc.id ?? selectedDoc.document_id
      const result = await contractAPI.analyze(id)
      setRiskData(result?.data || result)
      toast.success('Contract analyzed!')
    } catch (err) {
      toast.error(err.message || 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }
  if (fetching) return <Loading message="Loading documents…" />
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          Contract Risk Analysis
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Identify risks, problematic clauses, and liability issues in your contracts.
        </p>
      </motion.div>
      {/* Selector + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem 1.5rem' }}
      >
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Select Document
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <select
              value={selectedDoc?.id || selectedDoc?.document_id || ''}
              onChange={e => {
                const doc = documents.find(d => d.id === Number(e.target.value))
                setSelectedDoc(doc || null)
                setRiskData(null)
              }}
              style={{
                width: '100%', background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#f1f5f9',
                padding: '0.625rem 2rem 0.625rem 0.875rem',
                fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="">— Choose a document —</option>
              {documents.map(d => <option key={d.id} value={d.id}>{d.filename}</option>)}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!selectedDoc || loading}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: 8,
              background: selectedDoc && !loading ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
              color: selectedDoc && !loading ? '#fff' : '#475569',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: selectedDoc && !loading ? 'pointer' : 'not-allowed',
              border: 'none', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap',
            }}
          >
            <Shield size={15} />
            {loading ? 'Analyzing…' : 'Analyze Contract'}
          </button>
          {selectedDoc && (
            <button
              onClick={() => setShowPDF(!showPDF)}
              style={{
                padding: '0.625rem 1rem', borderRadius: 8,
                background: showPDF ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                color: showPDF ? '#22d3ee' : '#64748b',
                border: `1px solid ${showPDF ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`,
                fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {showPDF ? 'Hide PDF' : 'Preview PDF'}
            </button>
          )}
        </div>
      </motion.div>
      {/* PDF Preview */}
      {showPDF && selectedDoc && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <PDFViewer
            documentId={selectedDoc?.id ?? selectedDoc?.document_id}
            documentName={selectedDoc?.filename}
          />
        </motion.div>
      )}
      {/* Loading */}
      {loading && <Loading message="Scanning contract for risks with Gemini AI…" inline />}
      {/* Results */}
      {!loading && riskData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#f59e0b" /> Risk Assessment Results
            </h3>
            <ContractRiskCard data={riskData} filename={selectedDoc?.filename} />
          </div>
        </motion.div>
      )}
      {/* Empty */}
      {!loading && !riskData && (
        <div style={{ background: '#0d1425', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 14, padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Shield size={26} color="#f59e0b" />
          </div>
          <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>No analysis yet</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Select a document and click Analyze Contract to detect risks.</p>
        </div>
      )}
    </div>
  )
}
