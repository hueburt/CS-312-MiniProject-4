import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(userId, password, name);
      // Match old EJS behavior: redirect to sign-in after signup
      navigate('/signin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Create an Account</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="user_id">User ID</label>
          <input id="user_id" type="text" placeholder="e.g. janedoe"
                 value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password"
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Display Name</label>
          <input id="name" type="text" placeholder="e.g. Jane Doe"
                 value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Sign Up'}
          </button>
          <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>

      <p className="helper-text">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </section>
  );
}