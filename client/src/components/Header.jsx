import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <h1>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Mini Blog
        </Link>
      </h1>
      <p>Share your thoughts with the world</p>

      <nav className="user-nav">
        {user ? (
          <>
            <span>Signed in as <strong>{user.name}</strong></span>
            <button className="btn btn-secondary" onClick={handleSignout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn-secondary">Sign In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}