import { useState } from 'react'

const PRIORIDADES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
]

const STATUSES = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluída' },
]

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '')
  const [priority, setPriority] = useState(initialTask?.priority || 'media')
  const [status, setStatus] = useState(initialTask?.status || 'pendente')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      due_date: dueDate || null,
      priority,
      status,
    })
    if (!initialTask) {
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('media')
      setStatus('pendente')
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{initialTask ? 'Editar tarefa' : 'Nova tarefa'}</h2>

      <label htmlFor="title">Título</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label htmlFor="description">Descrição</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <div className="task-form-row">
        <div>
          <label htmlFor="dueDate">Data limite</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate || ''}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="priority">Prioridade</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORIDADES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-form-actions">
        <button type="submit">{initialTask ? 'Salvar alterações' : 'Adicionar tarefa'}</button>
        {initialTask && (
          <button type="button" className="link-button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
