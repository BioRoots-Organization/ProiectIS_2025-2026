import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardMedic from './pages/DashboardMedic'
import DashboardPacient from './pages/DashboardPacient'
import FisaPacient from './pages/FisaPacient'
import ProtectedRoute from './components/ProtectedRoute'
import ConfigurareContPacient from './pages/ConfigurareContPacient'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/configurare" element={
          <ProtectedRoute>
            <ConfigurareContPacient />
          </ProtectedRoute>
        } />
        <Route path="/medic" element={
          <ProtectedRoute>
            <DashboardMedic />
          </ProtectedRoute>
        } />
        <Route path="/pacient" element={
          <ProtectedRoute>
            <DashboardPacient />
          </ProtectedRoute>
        } />
        <Route path="/fisa/:id" element={
          <ProtectedRoute>
            <FisaPacient />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App