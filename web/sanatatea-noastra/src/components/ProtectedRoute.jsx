import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const esteAutentificat = sessionStorage.getItem('autentificat')
  
  if (!esteAutentificat) {
    return <Navigate to="/" />
  }
  
  return children
}

export default ProtectedRoute