import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PostList({ posts, onDelete }) {
  const { user } = useAuth();

  if (!posts || posts.length === 0) {
    return (
      <section className="posts-section">
        <h2>All Posts: (0)</h2>
        <p className="empty-msg">No posts yet. Be the first!</p>
      </section>
    );
  }

  return (
    <section className="posts-section">
      <h2>All Posts: ({posts.length})</h2>

      {posts.map((post) => {
        // Only the creator sees Edit/Delete — mirrors the EJS conditional
        const canModify = user && user.user_id === post.creator_user_id;

        return (
          <article className="post-card" key={post.blog_id}>
            <h3>{post.title}</h3>
            <div className="post-meta">
              <span>By {post.creator_name}</span>
              <span>Posted: {new Date(post.date_created).toLocaleString()}</span>
            </div>
            <p className="post-content">{post.body}</p>

            {canModify && (
              <div className="post-actions">
                <Link to={`/posts/${post.blog_id}/edit`} className="btn btn-edit">
                  Edit
                </Link>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    if (window.confirm('Delete this post?')) {
                      onDelete(post.blog_id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}