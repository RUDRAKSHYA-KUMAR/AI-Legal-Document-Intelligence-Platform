/**
 * ChatBox.jsx
 * Full chat interface with message history, bubbles, input, and voice support
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare } from 'lucide-react'
import { chatAPI } from '../services/api'
import VoiceButton from './VoiceButton'
import toast from 'react-hot-toast'
function TypingIndicator() {
  return (
    <div className="chat-bubble-wrap" style={{ maxWidth: '60%' }}>
      <div className="chat-avatar ai">AI</div>
      <div className="chat-bubble ai" style={{ padding: '0.625rem 0.875rem' }}>
        <div className="loading-pulse">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}
function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      className={`chat-bubble-wrap ${isUser ? 'user' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`chat-avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
        {msg.content}
      </div>
    </motion.div>
  )
}
export default function ChatBox({ documentId, documentName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef(null)
  const textareaRef             = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])
  // Reset when document changes
  useEffect(() => {
    setMessages([])
    setInput('')
  }, [documentId])
  const sendMessage = async (text) => {
    const question = (text || input).trim()
    if (!question || loading) return
    if (!documentId) {
      toast.error('Please select a document first.')
      return
    }
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    try {
      const result = await chatAPI.ask(documentId, question)
      const answer = result?.data?.answer || result?.answer || 'No response.'
      setMessages(prev => [...prev, { role: 'ai', content: answer }])
    } catch (err) {
      toast.error(err.message || 'Chat failed.')
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Sorry, something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  const handleVoice = (transcript) => {
    setInput(transcript)
    textareaRef.current?.focus()
  }
  const isEmpty = messages.length === 0
  return (
    <div className="chat-container" style={{ minHeight: 480 }}>
      {/* Messages */}
      <div className="chat-messages">
        {isEmpty && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
            style={{ flex: 1 }}
          >
            <div className="empty-state-icon" style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}>
              <MessageSquare size={28} color="#6366f1" />
            </div>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {documentName
                ? `Ask anything about "${documentName}"`
                : 'Select a document to start chatting'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 280, textAlign: 'center' }}>
              LEGAL-LENS will answer using only the content of the selected document.
            </p>
            {/* Starter prompts */}
            {documentId && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                {[
                  'What is this document about?',
                  'Who are the parties involved?',
                  'What are the key obligations?',
                  'Are there any risks I should know about?',
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: 'rgba(99,102,241,0.08)',
                      border: '1px solid rgba(99,102,241,0.15)',
                      borderRadius: 99,
                      color: 'var(--brand-secondary)',
                      fontSize: '0.775rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}
        </AnimatePresence>
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      {/* Input Row */}
      <div className="chat-input-row">
        <VoiceButton
          onTranscript={handleVoice}
          disabled={loading || !documentId}
        />
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder={documentId ? 'Ask a question about this document…' : 'Select a document first…'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading || !documentId}
          style={{ height: 44 }}
          onInput={(e) => {
            e.target.style.height = '44px'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading || !documentId}
          style={{ padding: '0.625rem 1rem', alignSelf: 'flex-end', flexShrink: 0 }}
        >
          {loading
            ? <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
            : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}