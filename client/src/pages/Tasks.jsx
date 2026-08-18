import { useEffect, useState } from 'react'
import api from '../api'
import Alert from '../components/Alert'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useAuth } from '../context/AuthContext'

export default function Tasks() {
  const { user, signOut } = useAuth()
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  const errorMessage = (err) =>
    err?.response?.data?.detail || 'Ocorreu um erro ao comunicar com o servidor.'

  const loadTasks = async () => {
    setLoading(true)
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateOrUpdate = async (taskData) => {
    setError('')
    setSuccess('')
    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, taskData)
        setSuccess('Tarefa atualizada com sucesso.')
      } else {
        await api.post('/tasks', taskData)
        setSuccess('Tarefa criada com sucesso.')
      }
      setEditingTask(null)
      await loadTasks()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const handleDelete = async (taskId) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/tasks/${taskId}`)
      setSuccess('Tarefa excluída com sucesso.')
      await loadTasks()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Minhas tarefas</h1>
        <div className="tasks-header-user">
          <span>{user?.email}</span>
          <button type="button" onClick={signOut}>
            Sair
          </button>
        </div>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <TaskForm
        key={editingTask?.id || 'new'}
        initialTask={editingTask}
        onSubmit={handleCreateOrUpdate}
        onCancel={() => setEditingTask(null)}
      />

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDelete} />
      )}
    </div>
  )
}
