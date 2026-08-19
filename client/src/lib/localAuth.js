/**
 * Auth "fake" para desenvolvimento do frontend isolado, sem depender do
 * Supabase nem de nenhum backend real.
 *
 * Implementa o mesmo formato de retorno usado pelo SDK do Supabase
 * (getSession / onAuthStateChange / signUp / signInWithPassword / signOut),
 * então o resto do app (AuthContext, Login) não precisa saber que é mock.
 *
 * Dados ficam em localStorage, então persistem entre reloads da página,
 * mas são 100% locais ao navegador — não há rede envolvida.
 *
 * QUANDO FOR LIGAR NO SUPABASE DE VERDADE:
 * troque o conteúdo de `src/supabaseClient.js` para usar
 * `createClient(...)` do '@supabase/supabase-js' novamente. Nenhum outro
 * arquivo do app precisa mudar, pois a interface (`supabase.auth.*`) é a
 * mesma.
 */

const USERS_KEY = 'demo_task_manager_users'
const SESSION_KEY = 'demo_task_manager_session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

function makeSession(user) {
  return {
    access_token: `demo-token-${user.id}`,
    user: { id: user.id, email: user.email },
  }
}

let listeners = []

function notifyListeners(session) {
  listeners.forEach((callback) => callback('SIGNED_IN', session))
}

// Simula latência de rede para o app se comportar como se fosse remoto
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const localAuth = {
  async getSession() {
    await delay(80)
    return { data: { session: readSession() } }
  },

  onAuthStateChange(callback) {
    listeners.push(callback)
    return {
      data: {
        subscription: {
          unsubscribe() {
            listeners = listeners.filter((cb) => cb !== callback)
          },
        },
      },
    }
  },

  async signUp({ email, password }) {
    await delay()

    if (!email || !password) {
      return { error: { message: 'Email e senha são obrigatórios.' } }
    }
    if (password.length < 6) {
      return { error: { message: 'A senha deve ter pelo menos 6 caracteres.' } }
    }

    const users = readUsers()
    if (users[email]) {
      return { error: { message: 'Este email já está cadastrado.' } }
    }

    const user = { id: `user-${Date.now()}`, email, password }
    users[email] = user
    writeUsers(users)

    const session = makeSession(user)
    writeSession(session)
    notifyListeners(session)

    return { error: null }
  },

  async signInWithPassword({ email, password }) {
    await delay()

    const users = readUsers()
    const user = users[email]

    if (!user || user.password !== password) {
      return { error: { message: 'Email ou senha inválidos.' } }
    }

    const session = makeSession(user)
    writeSession(session)
    notifyListeners(session)

    return { error: null }
  },

  async signOut() {
    await delay(80)
    writeSession(null)
    notifyListeners(null)
    return { error: null }
  },
}
