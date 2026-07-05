import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending',
};

export default function AddTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await api.post('/tasks', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="form-page-header">
          <h1>Add new task</h1>
        </div>

        <div className="form-card">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                className="input"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Submit assignment draft"
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
                placeholder="Add any relevant details…"
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
                {loading ? 'Saving…' : 'Save Task'}
              </button>
              <Link to="/dashboard" className="btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
