import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import ContractAnalysis from './pages/ContractAnalysis'
import ClauseExplainer from './pages/ClauseExplainer'
import ChatWithDocument from './pages/ChatWithDocument'
import Summary from './pages/Summary'
import Settings from './pages/Settings'
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navigation Sidebar */}
        <Sidebar />
        {/* Main Content Area */}
        <div className="main-content">
          <Navbar />
          {/* Page Routing */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/contract-analysis" element={<ContractAnalysis />} />
            <Route path="/clause-explainer" element={<ClauseExplainer />} />
            <Route path="/chat" element={<ChatWithDocument />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={
              <div className="page-wrapper">
                <div className="empty-state" style={{ minHeight: '60vh', justifyContent: 'center' }}>
                  <div className="empty-state-icon" style={{ background: 'rgba(244,63,94,0.1)', width: 80, height: 80 }}>
                    <span style={{ fontSize: '2rem' }}>404</span>
                  </div>
                  <h2 style={{ color: 'var(--text-primary)' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
      {/* Global Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#111827' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#111827' },
          },
        }}
      />
    </BrowserRouter>
  )
}
