/**
 * UploadCard.jsx
 * Drag-and-drop PDF upload zone with progress bar
 */
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { uploadAPI } from '../services/api'
import toast from 'react-hot-toast'
export default function UploadCard({ onSuccess }) {
  const [dragging, setDragging]   = useState(false)
  const [file, setFile]           = useState(null)
  const [progress, setProgress]   = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState(null)
  const inputRef                  = useRef(null)
  const reset = () => {
    setFile(null); setProgress(0); setUploading(false)
    setDone(false); setError(null)
  }
  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB.')
      return
    }
    setFile(f)
    setError(null)
    setDone(false)
  }, [])
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    handleFile(f)
  }, [handleFile])
  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const handleUpload = async () => {
    if (!file || uploading) return
    setUploading(true)
    setProgress(0)
    setError(null)
    try {
      const result = await uploadAPI.upload(file, setProgress)
      setDone(true)
      toast.success('Document uploaded successfully!')
      onSuccess?.(result?.data || result)
    } catch (err) {
      setError(err.message || 'Upload failed.')
      toast.error(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Drop Zone */}
      <motion.div
        className={`upload-zone${dragging ? ' dragging' : ''}`}
        onClick={() => !file && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        animate={{ scale: dragging ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ cursor: file ? 'default' : 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div className="upload-icon-wrap">
                <Upload size={32} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: '1rem' }}>
                  Drop your PDF here
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  or <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>browse files</span> · PDF only · Max 10 MB
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 480 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(99,102,241,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FileText size={22} color="#6366f1" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {formatSize(file.size)}
                </p>
              </div>
              {!uploading && !done && (
                <button
                  className="btn-icon"
                  onClick={(e) => { e.stopPropagation(); reset() }}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              )}
              {done && <CheckCircle size={22} color="#10b981" />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Progress Bar */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Uploading &amp; indexing…
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--brand-secondary)', fontWeight: 700 }}>
                {progress}%
              </p>
            </div>
            <div className="progress-bar-wrap">
              <motion.div
                className="progress-bar-fill"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.75rem 1rem',
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 10,
            }}
          >
            <AlertCircle size={16} color="#f43f5e" />
            <p style={{ fontSize: '0.8375rem', color: '#f43f5e' }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Upload Button */}
      {file && !done && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={uploading}
          style={{ alignSelf: 'flex-start', minWidth: 160 }}
        >
          {uploading ? (
            <>
              <div className="spinner spinner-sm" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={15} />
              Upload Document
            </>
          )}
        </motion.button>
      )}
      {/* Upload Another */}
      {done && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="btn btn-ghost"
          onClick={reset}
          style={{ alignSelf: 'flex-start' }}
        >
          Upload Another
        </motion.button>
      )}
    </div>
  )
}
