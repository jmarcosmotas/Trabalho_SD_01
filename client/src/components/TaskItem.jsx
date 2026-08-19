const PRIORITY_LABELS = { baixa: 'Baixa', media: 'Média', alta: 'Alta' }
const STATUS_LABELS = { pendente: 'Pendente', em_andamento: 'Em andamento', concluida: 'Concluída' }

export default function TaskItem({ task, onEdit, onDelete }) {
  return (
    <li className={`task-item priority-${task.priority} status-${task.status}`}>
      <div className="task-item-main">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-item-meta">
          <span className="badge">{PRIORITY_LABELS[task.priority]}</span>
          <span className="badge">{STATUS_LABELS[task.status]}</span>
          {task.due_date && <span>Prazo: {task.due_date}</span>}
        </div>
      </div>
      <div className="task-item-actions">
        <button type="button" onClick={() => onEdit(task)}>
          Editar
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </li>
  )
}
