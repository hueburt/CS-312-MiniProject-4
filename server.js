const express = require('express');
const session = require('express-session');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mini-blog-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

/* ---------------- Auth ---------------- */

app.get('/api/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post('/api/signup', async (req, res) => {
  const { user_id, password, name } = req.body;
  if (!user_id || !password || !name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const existing = await pool.query(
      'SELECT 1 FROM users WHERE user_id = $1', [user_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'That user ID is already taken. Please choose another.'
      });
    }
    await pool.query(
      'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
      [user_id, password, name]
    );
    res.status(201).json({ message: 'Account created. Please sign in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT user_id, name FROM users WHERE user_id = $1 AND password = $2',
      [user_id, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Incorrect user ID or password. Please try again.'
      });
    }
    req.session.user = result.rows[0];
    res.json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signin.' });
  }
});

app.post('/api/signout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Signed out.' }));
});

/* ---------------- Posts ---------------- */

app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs ORDER BY date_created DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching posts.' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      'SELECT * FROM blogs WHERE blog_id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    const post = result.rows[0];
    if (!req.session.user || post.creator_user_id !== req.session.user.user_id) {
      return res.status(403).json({ error: 'You can only edit your own posts.' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching post.' });
  }
});

app.post('/api/posts', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must sign in to post.' });
  }
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [req.session.user.name, req.session.user.user_id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating post.' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!req.session.user) return res.status(401).json({ error: 'Not signed in.' });

  try {
    const check = await pool.query(
      'SELECT * FROM blogs WHERE blog_id = $1', [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    const post = check.rows[0];
    if (post.creator_user_id !== req.session.user.user_id) {
      return res.status(403).json({ error: 'You can only edit your own posts.' });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const updated = await pool.query(
      'UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 RETURNING *',
      [title, content, id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating post.' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!req.session.user) return res.status(401).json({ error: 'Not signed in.' });

  try {
    const check = await pool.query(
      'SELECT * FROM blogs WHERE blog_id = $1', [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (check.rows[0].creator_user_id !== req.session.user.user_id) {
      return res.status(403).json({ error: 'You can only delete your own posts.' });
    }
    await pool.query('DELETE FROM blogs WHERE blog_id = $1', [id]);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting post.' });
  }
});

app.listen(PORT, () => {
  console.log('API server running at http://localhost:' + PORT);
});
