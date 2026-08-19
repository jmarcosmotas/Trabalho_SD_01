import { localAuth } from './localAuth'

const TASKS_KEY = 'demo_task_manager_tasks'

function readTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function apiError(status, detail) {
  const error = new Error(detail)
  error.response = { status, data: { detail } }
  return error
}

async function getCurrentUserId() {
  const { data } = await localAuth.getSession()
  const userId = data.session?.user?.id
  if (!userId) {
    throw apiError(401, 'Token de autenticação ausente ou mal formatado.')
  }
  return userId
}

function nowIso() {
  return new Date().toISOString()
}

function extractId(url) {
  return url.split('/').filter(Boolean).pop()
}

export const localTasksApi = {
  async get(url) {
    await delay()
    const userId = await getCurrentUserId()

    if (url === '/tasks') {
      const tasks = readTasks()
        .filter((t) => t.user_id === userId)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      return { data: tasks }
    }

    const id = extractId(url)
    const task = readTasks().find((t) => t.id === id && t.user_id === userId)
    if (!task) throw apiError(404, 'Tarefa não encontrada.')
    return { data: task }
  },

  async post(url, payload) {
    await delay()
    const userId = await getCurrentUserId()

    if (!payload?.title || !payload.title.trim()) {
      throw apiError(422, 'O título é obrigatório.')
    }

    const tasks = readTasks()
    const now = nowIso()
    const task = {
      id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      user_id: userId,
      title: payload.title.trim(),
      description: payload.description || '',
      due_date: payload.due_date || null,
      priority: payload.priority || 'media',
      status: payload.status || 'pendente',
      created_at: now,
      updated_at: now,
    }
    tasks.push(task)
    writeTasks(tasks)
    return { data: task }
  },

  async patch(url, payload) {
    await delay()
    const userId = await getCurrentUserId()
    const id = extractId(url)

    const tasks = readTasks()
    const index = tasks.findIndex((t) => t.id === id && t.user_id === userId)
    if (index === -1) throw apiError(404, 'Tarefa não encontrada.')

    if ('title' in payload && !payload.title?.trim()) {
      throw apiError(422, 'O título é obrigatório.')
    }

    tasks[index] = { ...tasks[index], ...payload, updated_at: nowIso() }
    writeTasks(tasks)
    return { data: tasks[index] }
  },

  async delete(url) {
    await delay()
    const userId = await getCurrentUserId()
    const id = extractId(url)

    const tasks = readTasks()
    const exists = tasks.some((t) => t.id === id && t.user_id === userId)
    if (!exists) throw apiError(404, 'Tarefa não encontrada.')

    writeTasks(tasks.filter((t) => !(t.id === id && t.user_id === userId)))
    return { data: null }
  },
}
