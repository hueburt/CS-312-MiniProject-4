import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load existing post and pre-fill form fields
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const post = await api.getPost(id);
        if (!cancelled) {
          setTitle(post.title);
          setContent(post.body);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.updatePost(id, { title, content });
      navigate('/');           // Home re-fetches → updated post shows up
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  // Backend 403 (not creator / not signed in) lands here
  if (error && !title) {
    return (
      <section className="card">
        <h2>Edit Post</h2>
        <p className="error-msg">{error}</p>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Edit Post</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" type="text"
                 value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" rows="6"
                    value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </section>
  );
}