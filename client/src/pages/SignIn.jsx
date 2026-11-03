import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signin(userId, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Welcome Back</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="user_id">User ID</label>
          <input id="user_id" type="text"
                 value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password"
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
          <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>

      <p className="helper-text">
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  );
}