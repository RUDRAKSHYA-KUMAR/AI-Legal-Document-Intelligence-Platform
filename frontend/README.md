# Legal-Lens — AI Legal Document Intelligence Platform

LexAI is an AI-powered legal document analysis application designed to parse, analyze, and query contracts or other legal documents. It leverages FastAPI on the backend and Google Gemini API with RAG (Retrieval-Augmented Generation) to deliver intelligent document summaries, contract risk analysis, plain-language clause explanations, and interactive chat capabilities.

---

## 📁 Frontend Directory Structure

```text
frontend/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images and design assets
│   ├── components/         # Reusable UI widgets
│   │   ├── Navbar.jsx            # Top navigation bar with dynamic page header
│   │   ├── Sidebar.jsx           # Side navigation with grouped route sections
│   │   ├── UploadCard.jsx        # Drag-and-drop PDF uploader with progress indicator
│   │   ├── DocumentCard.jsx      # Document overview card with key action triggers
│   │   ├── ChatBox.jsx           # Chat window supporting voice transcript integration
│   │   ├── VoiceButton.jsx       # Microphone wrapper using the Web Speech API
│   │   ├── SummaryCard.jsx       # Layout containing summarized text and key points
│   │   ├── ContractRiskCard.jsx  # Color-coded risk report panel
│   │   ├── ClauseCard.jsx        # Plain-English translation card for extracted clauses
│   │   ├── Loading.jsx           # Reusable inline spinner and full-screen loading overlay
│   │   └── PDFViewer.jsx         # Iframe-based PDF document previewer with zoom
│   ├── pages/              # View-level components mapped to application routes
│   │   ├── Dashboard.jsx         # System overview dashboard displaying documents and statistics
│   │   ├── Upload.jsx            # File import interface
│   │   ├── ContractAnalysis.jsx  # Risk assessment screen
│   │   ├── ClauseExplainer.jsx   # Plain-language clause analysis
│   │   ├── ChatWithDocument.jsx  # Context-aware document Q&A
│   │   ├── Summary.jsx           # AI document summary panel
│   │   └── Settings.jsx          # Environment preferences & backend API connection configuration
│   ├── services/           # Network operations
│   │   └── api.js                # Axios client configurations and backend REST calls
│   ├── styles/             # Global themes
│   ├── App.jsx             # React Router routing configuration
│   └── main.jsx            # Root script entry point
├── index.html              # HTML entry point for the browser
├── package.json            # Core build script & package dependencies list
└── vite.config.js          # Vite compilation settings
```

---

## 🛠️ Project Setup & Installation

### 1. Backend Setup
Make sure your FastAPI server is configured and running:
* Python version `3.8+` is recommended.
* Virtual environment activated, dependencies installed (`pip install -r requirements.txt`).
* Run the server:
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```
  *(Default server location: `http://localhost:8000`)*

### 2. Frontend Setup
Navigate into the frontend directory and install the necessary dependencies:
```bash
cd frontend
npm install
```

### 3. Running Locally
Run the React development server:
```bash
npm run dev
```
Open the provided local network address (usually `http://localhost:5173`) in your browser to view the application.

---

## 🚀 Key Technologies Used
* **Frontend Core**: React 19, React Router, Axios
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Styling**: Modern CSS Variables & Responsive Layouts
* **Backend Framework**: FastAPI (Uvicorn)
* **LLM Engine**: Google Gemini API
* **Search Context**: Retrieval-Augmented Generation (RAG)
