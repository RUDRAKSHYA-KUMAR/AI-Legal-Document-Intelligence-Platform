
import axios from 'axios'
// ─── Base Client ──────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})
// ─── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)
// ─── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)
// ─── Documents ────────────────────────────────────────────────
export const documentsAPI = {
  /** GET /documents/ — list all documents */
  getAll: () => api.get('/documents/'),
  /** GET /documents/:id — get single document */
  getById: (id) => api.get(`/documents/${id}`),
  /** DELETE /documents/:id — delete document */
  delete: (id) => api.delete(`/documents/${id}`),
  /** GET /documents/:id/download — download document */
  downloadUrl: (id) => `${api.defaults.baseURL}/documents/${id}/download`,
}
// ─── Upload ───────────────────────────────────────────────────
export const uploadAPI = {
  /**
   * POST /upload/ — upload a PDF document
   * @param {File} file
   * @param {Function} onProgress - progress callback (0-100)
   */
  upload: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      },
    })
  },
}
// ─── Summary ──────────────────────────────────────────────────
export const summaryAPI = {
  /**
   * POST /summary/ — generate summary for a document
   * @param {number} documentId
   */
  generate: (documentId) =>
    api.post('/summary/', { document_id: documentId }),
}
// ─── Contract Analysis ────────────────────────────────────────
export const contractAPI = {
  /**
   * POST /contract/ — analyze contract for risks
   * @param {number} documentId
   */
  analyze: (documentId) =>
    api.post('/contract/', { document_id: documentId }),
}
// ─── Clause Extraction ────────────────────────────────────────
export const clauseAPI = {
  /**
   * POST /clause/ — extract and explain clauses
   * @param {number} documentId
   */
  extract: (documentId) =>
    api.post('/clause/', { document_id: documentId }),
}
// ─── Chat ─────────────────────────────────────────────────────
export const chatAPI = {
  /**
   * POST /chat/ — ask a question about a document
   * @param {number} documentId
   * @param {string} question
   */
  ask: (documentId, question) =>
    api.post('/chat/', { document_id: documentId, question }),
}
export default api
