const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryPosts = [
  {
    id: 1,
    title: 'The Future of B2B Web Design in 2026: Dark Mode & Glassmorphic Systems',
    slug: 'future-of-b2b-web-design-2026',
    category_id: 2,
    category_name: 'UI/UX Insights',
    excerpt: 'Why modern B2B decision makers respond to high-tech visual hierarchy and performance-first web applications.',
    content_html: `
      <h3>1. The Shift to High-Contrast Dark Environments</h3>
      <p>Modern executives work long hours across multiple displays. High-contrast dark backgrounds paired with glowing accents (#6366f1) reduce eye strain while creating an instant impression of futuristic precision.</p>
      <h3>2. Performance as a Design Feature</h3>
      <p>A visual system is only as good as its frame rate. Combining React components with optimized CSS reduces bundle size and achieves sub-100ms interaction responses.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    meta_title: 'Future of B2B Web Design 2026 | DigiAgency',
    meta_desc: 'Discover why dark mode glassmorphic web design drives higher conversion for modern B2B SaaS and enterprise brands.',
    status: 'PUBLISHED',
    created_at: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Maximizing ROI with React & Modern Express CMS Architecture',
    slug: 'maximizing-roi-react-express-cms',
    category_id: 3,
    category_name: 'Development',
    excerpt: 'How decoupling your marketing frontend from custom backend APIs delivers sub-second load times and flawless security.',
    content_html: `
      <h3>Decoupled CMS vs Traditional Monoliths</h3>
      <p>By deploying React SPA frontend bundles alongside Node.js Express REST APIs on CPanel or cloud servers, teams achieve rapid iteration cycles without exposing database surfaces directly.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    meta_title: 'React Express CMS ROI Guide | DigiAgency',
    meta_desc: 'Learn how a headless or decoupled React Express CMS architecture drives faster load times and lowers maintenance costs.',
    status: 'PUBLISHED',
    created_at: '2026-08-18T14:30:00.000Z'
  }
];

let memoryCategories = [
  { id: 1, name: 'Digital Strategy', slug: 'digital-strategy' },
  { id: 2, name: 'UI/UX Insights', slug: 'ui-ux-insights' },
  { id: 3, name: 'Development', slug: 'development' }
];

// GET /api/posts (Public)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryPosts });
  }
});

// GET /api/posts/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryCategories });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1 OR p.slug = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryPosts.find(p => p.id === parseInt(id) || p.slug === id);
    if (!item) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, data: item });
  }
});

// POST /api/posts (Admin)
router.post('/', verifyToken, async (req, res) => {
  const { title, slug, category_id, excerpt, content_html, featured_image, meta_title, meta_desc, status } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO posts (title, slug, category_id, excerpt, content_html, featured_image, meta_title, meta_desc, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, slug || title.toLowerCase().replace(/ /g, '-'), category_id, excerpt, content_html, featured_image, meta_title, meta_desc, status || 'PUBLISHED']
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newPost = {
      id: Date.now(),
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-'),
      category_id,
      category_name: 'General',
      excerpt,
      content_html,
      featured_image,
      meta_title,
      meta_desc,
      status: status || 'PUBLISHED',
      created_at: new Date().toISOString()
    };
    memoryPosts.push(newPost);
    return res.status(201).json({ success: true, data: newPost });
  }
});

// DELETE /api/posts/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    memoryPosts = memoryPosts.filter(p => p.id !== parseInt(id));
    return res.json({ success: true, message: 'Post deleted successfully' });
  }
});

module.exports = router;
