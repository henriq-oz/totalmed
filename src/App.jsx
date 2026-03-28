import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Suas outras rotas aqui */}
      </Routes>
    </Router>
  )
}

export default App