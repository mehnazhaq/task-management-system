import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import ConfirmDialog from '../components/ConfirmDialog';

const PRIORITY_CLASS = { High: 'stamp-high', Medium: 'stamp-medium', Low: 'stamp-low' };
const STATUS_CLASS = {
  Pending: 'stamp-pending',
  'In Progress': 'stamp-progress',
  Completed: 'stamp-completed',
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTask = () => {
    setLoading(true);
    api
      .get(`/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch(() => setError('Could not load this task.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleToggle = async () => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.put(`/tasks/${id}`, { status: newStatus });
      setTask(res.data);
    } catch {
      setError('Could not update status.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/dashboard');
    } catch {
      setError('Could not delete task.');
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <Link to="/dashboard" className="btn-text">
          ← Back to dashboard
        </Link>

        {loading ? (
          <Loader label="Loading task…" />
        ) : error && !task ? (
          <div className="form-error" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        ) : (
          task && (
            <div className="detail-card" style={{ marginTop: '1rem' }}>
              <div className="detail-header">
                <h1 className="detail-title">{task.title}</h1>
                <div className="tag-row">
                  <span className={`stamp ${PRIORITY_CLASS[task.priority]}`}>{task.priority}</span>
                  <span className={`stamp ${STATUS_CLASS[task.status]}`}>{task.status}</span>
                </div>
              </div>

              <div className="detail-meta">
                <span>
                  Due:{' '}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
                <span>
                  Created:{' '}
                  {new Date(task.createdDate || task.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="detail-desc">{task.description || 'No description provided.'}</p>

              {error && <div className="form-error">{error}</div>}

              <div className="detail-actions">
                <button className="btn btn-primary" onClick={handleToggle}>
                  Mark as {task.status === 'Completed' ? 'Pending' : 'Completed'}
                </button>
                <button className="btn" onClick={() => navigate(`/tasks/edit/${task._id}`)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        message={`"${task?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
}
