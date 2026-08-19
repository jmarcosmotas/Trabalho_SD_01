import { useState } from 'react'
import Alert from '../components/Alert'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const errorMessage = (err) =>
    err?.response?.data?.detail || 'Ocorreu um erro ao comunicar com o servidor.'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn({ email, password })
      } else {
        await signUp({ email, password })
        setInfo('Cadastro realizado com sucesso. Faça login para continuar.')
        setMode('login')
        setPassword('')
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={info} onClose={() => setInfo('')} />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => setMode(mode === 'login' ? 'cadastro' : 'login')}
        >
          {mode === 'login' ? 'Criar uma conta nova' : 'Já tenho conta, entrar'}
        </button>
      </form>
    </div>
  )
}