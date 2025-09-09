import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage.tsx'
/* import AndreiDashboard from './pages/AndreiDashboard'
import DaemonDashboard from './pages/DaemonDashboard'
import NetworkDashboard from './pages/NetworkDashboard' */
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
      {/*   <Route path="/andrei" element={<AndreiDashboard />} />
        <Route path="/daemons" element={<DaemonDashboard />} />
        <Route path="/network" element={<NetworkDashboard />} /> */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
