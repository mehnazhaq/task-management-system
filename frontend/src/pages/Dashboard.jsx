import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      setError('Could not update task status.');
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      setTaskToDelete(null);
    } catch (err) {
      setError('Could not delete task.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Your tasks</h1>
            <span className="dash-subtitle">
              {tasks.length} total · {tasks.filter((t) => t.status === 'Completed').length} completed
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/tasks/add')}>
            + Add Task
          </button>
        </div>

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <Loader />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title={tasks.length === 0 ? 'No tasks found.' : 'No tasks match your filters.'}
            message={
              tasks.length === 0
                ? 'Start by creating your first task.'
                : 'Try adjusting your search or filters.'
            }
            actionLabel={tasks.length === 0 ? 'Add Task' : undefined}
            onAction={() => navigate('/tasks/add')}
          />
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={setTaskToDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete this task?"
        message={`"${taskToDelete?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        loading={deleting}
      />
    </>
  );
}
