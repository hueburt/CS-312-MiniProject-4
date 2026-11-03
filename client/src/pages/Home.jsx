import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BlogPostForm from '../components/BlogPostForm';
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const refreshPosts = useCallback(async () => {
    try {
      const data = await api.listPosts();
      // console.log(data); // ← Step 3 verification line
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { refreshPosts(); }, [refreshPosts]);

  const handleCreated = () => refreshPosts();

  const handleDelete = async (id) => {
    try {
      await api.deletePost(id);
      // Optimistically drop it from state so UI updates instantly
      setPosts((prev) => prev.filter((p) => p.blog_id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {user ? (
        <section className="card">
          <h2>Create a New Post</h2>
          <BlogPostForm onCreated={handleCreated} />
        </section>
      ) : (
        <section className="card">
          <h2>Want to post?</h2>
          <p className="helper-text">
            Please <Link to="/signin">sign in</Link> or{' '}
            <Link to="/signup">sign up</Link> to write a new post.
          </p>
        </section>
      )}

      {error && <p className="error-msg">{error}</p>}

      <PostList posts={posts} onDelete={handleDelete} />
    </>
  );
}