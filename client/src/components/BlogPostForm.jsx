import { useState } from 'react';
import { api } from '../api';

export default function BlogPostForm({ onCreated }) {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [error, setError]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();                 // prevent full-page reload
    setError(null);
    setSubmitting(true);
    try {
      await api.createPost({ title, content });
      setTitle('');
      setContent('');
      onCreated && onCreated();         // tell Home to re-fetch
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {error && <p className="error-msg">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Blog Title</label>
        <input
          type="text"
          id="title"
          placeholder="e.g. My First Post"
          value={title}                       /* bound to state */
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Blog Content</label>
        <textarea
          id="content"
          rows="6"
          placeholder="Write your blog here..."
          value={content}                     /* bound to state */
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
}