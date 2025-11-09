import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { WalletProvider } from './contexts/WalletContext'
import Navigation from './components/Navigation'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Agreements from './pages/Agreements'
import RecordProof from './pages/RecordProof'
import Verify from './pages/Verify'
import About from './pages/About'
import Settings from './pages/Settings'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-primary-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Dashboard />} />
              <Route path="/agreements" element={<Agreements />} />
              <Route path="/record-proof" element={<RecordProof />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App