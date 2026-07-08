/**
 * VoiceButton.jsx
 * Mic button using Web Speech API — captures voice and returns transcript
 */
import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
export default function VoiceButton({ onTranscript, disabled = false }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'recording' | 'processing'
  const recognitionRef = useRef(null)
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const startRecording = useCallback(() => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognition.onstart = () => setStatus('recording')
    recognition.onresult = (event) => {
      setStatus('processing')
      const transcript = event.results[0][0].transcript.trim()
      if (transcript) {
        onTranscript?.(transcript)
        toast.success('Voice captured!')
      }
      setTimeout(() => setStatus('idle'), 400)
    }
    recognition.onerror = (event) => {
      setStatus('idle')
      if (event.error !== 'no-speech') {
        toast.error(`Voice error: ${event.error}`)
      }
    }
    recognition.onend = () => {
      if (status !== 'processing') setStatus('idle')
    }
    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported, onTranscript, status])
  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [])
  const handleClick = () => {
    if (disabled) return
    if (status === 'recording') {
      stopRecording()
    } else if (status === 'idle') {
      startRecording()
    }
  }
  const getTitle = () => {
    if (!isSupported) return 'Speech recognition not supported'
    if (status === 'recording') return 'Click to stop recording'
    if (status === 'processing') return 'Processing…'
    return 'Click to speak'
  }
  return (
    <button
      className={`voice-btn ${status === 'recording' ? 'recording' : 'idle'}`}
      onClick={handleClick}
      disabled={disabled || status === 'processing' || !isSupported}
      title={getTitle()}
      type="button"
    >
      {status === 'processing' ? (
        <Loader size={18} style={{ animation: 'spin 0.75s linear infinite' }} />
      ) : status === 'recording' ? (
        <MicOff size={18} />
      ) : (
        <Mic size={18} />
      )}
    </button>
  )
}
