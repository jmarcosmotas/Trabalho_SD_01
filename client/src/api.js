const baseURL = 'http://localhost:5000'
const TOKEN_KEY = 'access_token'

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Função central: todas as chamadas à API passam por aqui.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.detail || 'Ocorreu um erro ao comunicar com o servidor.')
    error.response = { status: response.status, data }
    throw error
  }

  return data
}

// ---------- Autenticação ----------

export function login({ email, password }) {
  return request('/login', { method: 'POST', body: { email, password } })
}

export function cadastrar({ email, password }) {
  return request('/cadastrar', { method: 'POST', body: { email, password } })
}

// ---------- Tarefas ----------

const PRIORITY_TO_BACKEND = { baixa: 'Baixa', media: 'Média', alta: 'Alta' }
const STATUS_TO_BACKEND = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizeKey(value) {
  if (!value) return value
  return stripAccents(value).toLowerCase().trim().replace(/\s+/g, '_')
}

function toBackendPayload(task) {
  return {
    titulo: task.title,
    descricao: task.description || '',
    data_limite: task.due_date,
    prioridade: PRIORITY_TO_BACKEND[task.priority] || task.priority,
    status: STATUS_TO_BACKEND[task.status] || task.status,
  }
}

function fromBackendTask(t) {
  return {
    id: t.id,
    title: t.titulo,
    description: t.descricao,
    due_date: t.data_limite,
    priority: normalizeKey(t.prioridade),
    status: normalizeKey(t.status),
  }
}

export async function listTasks() {
  const data = await request('/read', { auth: true })
  return (data.tarefas || []).map(fromBackendTask)
}

export async function createTask(task) {
  const data = await request('/create', {
    method: 'POST',
    body: toBackendPayload(task),
    auth: true,
  })
  const tarefa = Array.isArray(data.tarefa) ? data.tarefa[0] : data.tarefa
  return fromBackendTask(tarefa)
}

export async function updateTask(id, task) {
  const data = await request('/update', {
    method: 'PUT',
    body: { id, ...toBackendPayload(task) },
    auth: true,
  })
  const tarefa = Array.isArray(data.tarefa) ? data.tarefa[0] : data.tarefa
  return fromBackendTask(tarefa)
}

export async function deleteTask(id) {
  await request('/delete', { method: 'DELETE', body: { id }, auth: true })
}