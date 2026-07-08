/**
 * PDFViewer.jsx
 * Embeds the PDF using the backend download endpoint
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ExternalLink, Maximize2, Minimize2 } from 'lucide-react'
import { documentsAPI } from '../services/api'
export default function PDFViewer({ documentId, documentName }) {
  const [expanded, setExpanded] = useState(false)
  if (!documentId) return null
  const pdfUrl = documentsAPI.downloadUrl(documentId)
  return (
    <motion.div
      className="pdf-viewer-wrap"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="pdf-viewer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'rgba(244,63,94,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={14} color="#f43f5e" />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              PDF Preview
            </p>
            {documentName && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {documentName}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-icon"
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
          <button
            className="btn-icon"
            onClick={() => setExpanded(p => !p)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      {/* iFrame */}
      <motion.iframe
        className="pdf-viewer-iframe"
        src={`${pdfUrl}#toolbar=1&navpanes=0`}
        title={documentName || 'PDF Document'}
        animate={{ height: expanded ? 900 : 600 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
    </motion.div>
  )
}