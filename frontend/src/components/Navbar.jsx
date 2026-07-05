import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          Ledger<span>.</span>
        </Link>
        <div className="navbar-user">
          <span className="navbar-avatar">{initial}</span>
          <span>{user?.name}</span>
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
