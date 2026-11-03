const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  me:          ()        => request('/me'),
  signup:      (p)       => request('/signup', { method: 'POST', body: JSON.stringify(p) }),
  signin:      (p)       => request('/signin', { method: 'POST', body: JSON.stringify(p) }),
  signout:     ()        => request('/signout', { method: 'POST' }),
  listPosts:   ()        => request('/posts'),
  getPost:     (id)      => request(`/posts/${id}`),
  createPost:  (p)       => request('/posts', { method: 'POST', body: JSON.stringify(p) }),
  updatePost:  (id, p)   => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deletePost:  (id)      => request(`/posts/${id}`, { method: 'DELETE' })
};