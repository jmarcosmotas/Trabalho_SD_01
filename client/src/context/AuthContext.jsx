import { createContext, useContext, useEffect, useState } from 'react'
import { login, cadastrar, setToken, clearToken } from '../api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        clearToken()
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async ({ email, password }) => {
    const data = await login({ email, password })
    setToken(data.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
  }

  const signUp = async ({ email, password }) => {
    // /cadastrar não devolve token: o usuário precisa logar em seguida
    await cadastrar({ email, password })
  }

  const signOut = () => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}