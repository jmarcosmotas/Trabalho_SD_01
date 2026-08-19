import { useState } from 'react'
import Alert from '../components/Alert'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'cadastro'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { error: authError } = await action
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'cadastro') {
      setInfo('Cadastro realizado. Verifique seu email para confirmar a conta, se necessário.')
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
