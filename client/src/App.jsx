import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Tasks from './pages/Tasks'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }

  return (
    <>
      {user ? <Tasks /> : <Login />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
