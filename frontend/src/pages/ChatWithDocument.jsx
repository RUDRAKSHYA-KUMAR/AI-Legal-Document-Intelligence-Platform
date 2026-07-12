import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, ChevronDown, LayoutPanelLeft } from 'lucide-react'
import { documentsAPI } from '../services/api'
import ChatBox from '../components/ChatBox'
import PDFViewer from '../components/PDFViewer'
import Loading from '../components/Loading'
export default function ChatWithDocument() {
  const { state } = useLocation()
  const [documents, setDocuments]     = useState([])
  const [selectedDoc, setSelectedDoc] = useState(state?.document || null)
  const [fetching, setFetching]       = useState(true)
  const [splitView, setSplitView]     = useState(false)
  useEffect(() => { fetchDocs() }, [])
  const fetchDocs = async () => {
    setFetching(true)
    try {
      const r = await documentsAPI.getAll()
      setDocuments(r?.data || [])
    } catch { setDocuments([]) }
    finally { setFetching(false) }
  }
  if (fetching) return <Loading message="Loading documents…" />
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          Chat with Document
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ask any question about your legal document and get accurate AI answers using RAG.
        </p>
      </motion.div>
      {/* Selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem 1.5rem' }}
      >
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Select Document to Chat With
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <select
              value={selectedDoc?.id || selectedDoc?.document_id || ''}
              onChange={e => {
                const doc = documents.find(d => d.id === Number(e.target.value))
                setSelectedDoc(doc || null)
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
            onClick={() => setSplitView(!splitView)}
            disabled={!selectedDoc}
            style={{
              padding: '0.625rem 1rem', borderRadius: 8,
              background: splitView ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
              color: splitView ? '#22d3ee' : '#64748b',
              border: `1px solid ${splitView ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
              cursor: selectedDoc ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap',
              opacity: selectedDoc ? 1 : 0.4,
            }}
          >
            <LayoutPanelLeft size={14} />
            {splitView ? 'Hide PDF' : 'Split View'}
          </button>
        </div>
      </motion.div>
      {/* Prompt when no doc */}
      {!selectedDoc && (
        <div style={{ background: '#0d1425', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 14, padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <MessageSquare size={26} color="#6366f1" />
          </div>
          <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Select a document to start chatting</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Once selected, you can ask anything — parties, obligations, deadlines, risks.</p>
        </div>
      )}
      {/* Chat + Optional PDF split */}
      {selectedDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: splitView ? '1fr 1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}
        >
          <ChatBox
            documentId={selectedDoc?.id ?? selectedDoc?.document_id}
            documentName={selectedDoc?.filename}
          />
          {splitView && (
            <PDFViewer
              documentId={selectedDoc?.id ?? selectedDoc?.document_id}
              documentName={selectedDoc?.filename}
            />
          )}
        </motion.div>
      )}
    </div>
  )
}
