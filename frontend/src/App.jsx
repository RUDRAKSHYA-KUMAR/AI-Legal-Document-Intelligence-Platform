import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Navigation Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="main-content" style={{ flex: 1, padding: '20px', marginLeft: '260px' }}>
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Navigation Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="main-content" style={{ flex: 1, padding: '20px', marginLeft: '260px' }}>
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}