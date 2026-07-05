import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/tasks/${id}`)
      .then((res) => {
        const task = res.data;
        setForm({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
          priority: task.priority,
          status: task.status,
        });
      })
      .catch(() => setError('Could not load this task.'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/tasks/${id}`, form);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="form-page-header">
          <h1>Edit task</h1>
        </div>

        {fetching ? (
          <Loader label="Loading task…" />
        ) : (
          <div className="form-card">
            {error && <div className="form-error">{error}</div>}

            {form && (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    className="input"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="input"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="dueDate">Due date</label>
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      className="input"
                      value={form.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      className="input"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="input"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating…' : 'Update Task'}
                  </button>
                  <Link to={`/tasks/${id}`} className="btn">
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </>
  );
}
