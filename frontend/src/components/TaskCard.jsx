import { useNavigate } from 'react-router-dom';

const PRIORITY_CLASS = {
  High: 'stamp-high',
  Medium: 'stamp-medium',
  Low: 'stamp-low',
};

const STATUS_CLASS = {
  Pending: 'stamp-pending',
  'In Progress': 'stamp-progress',
  Completed: 'stamp-completed',
};

export default function TaskCard({ task, onDelete, onToggleComplete }) {
  const navigate = useNavigate();

  const formattedDue = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    : '—';

  return (
    <div className="task-card" onClick={() => navigate(`/tasks/${task._id}`)}>
      <span className="task-card-ticket">#{task._id?.slice(-5)}</span>
      <div className="task-card-title">{task.title}</div>
      {task.description && <div className="task-card-desc">{task.description}</div>}

      <div className="tag-row">
        <span className={`stamp ${PRIORITY_CLASS[task.priority] || 'stamp-medium'}`}>
          {task.priority}
        </span>
        <span className={`stamp ${STATUS_CLASS[task.status] || 'stamp-pending'}`}>
          {task.status}
        </span>
      </div>

      <div className="task-card-footer">
        <span className="task-card-due">Due {formattedDue}</span>
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="icon-btn"
            title="Mark complete/pending"
            onClick={() => onToggleComplete(task)}
          >
            ✓
          </button>
          <button
            className="icon-btn"
            title="Edit task"
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
          >
            ✎
          </button>
          <button className="icon-btn" title="Delete task" onClick={() => onDelete(task)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
