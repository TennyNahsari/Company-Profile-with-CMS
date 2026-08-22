const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryPages = [
  {
    id: 1,
    title: 'Custom Landing Page: AI Marketing Suite',
    slug: 'ai-marketing-suite',
    content_blocks: [
      { type: 'hero', heading: 'Autonomous AI Marketing Campaigns', subheading: 'Drive higher acquisition with algorithmic budget allocation.' }
    ],
    custom_html_css: '<style>.custom-banner { padding: 40px; background: rgba(99, 102, 241, 0.15); border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); }</style><div class="custom-banner"><h2>Enterprise AI Engine</h2><p>Custom HTML & CSS block live rendering.</p></div>',
    meta_seo: { title: 'AI Marketing Suite | DigiAgency', description: 'Next-generation automated marketing solutions.' },
    updated_at: '2026-08-21T12:00:00.000Z'
  }
];

// GET /api/pages
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pages ORDER BY id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryPages });
  }
});

// GET /api/pages/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM pages WHERE id = $1 OR slug = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Page not found' });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryPages.find(p => p.id === parseInt(id) || p.slug === id);
    if (!item) return res.status(404).json({ success: false, message: 'Page not found' });
    return res.json({ success: true, data: item });
  }
});

// POST /api/pages (Admin)
router.post('/', verifyToken, async (req, res) => {
  const { title, slug, content_blocks, custom_html_css, meta_seo } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO pages (title, slug, content_blocks, custom_html_css, meta_seo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, slug || title.toLowerCase().replace(/ /g, '-'), JSON.stringify(content_blocks || []), custom_html_css, JSON.stringify(meta_seo || {})]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newPage = {
      id: Date.now(),
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-'),
      content_blocks: content_blocks || [],
      custom_html_css,
      meta_seo: meta_seo || {},
      updated_at: new Date().toISOString()
    };
    memoryPages.push(newPage);
    return res.status(201).json({ success: true, data: newPage });
  }
});

// PUT /api/pages/:id (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, content_blocks, custom_html_css, meta_seo } = req.body;
  try {
    const result = await db.query(
      `UPDATE pages SET title = $1, slug = $2, content_blocks = $3, custom_html_css = $4, meta_seo = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      [title, slug, JSON.stringify(content_blocks), custom_html_css, JSON.stringify(meta_seo), id]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const index = memoryPages.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      memoryPages[index] = {
        ...memoryPages[index],
        title, slug, content_blocks, custom_html_css, meta_seo, updated_at: new Date().toISOString()
      };
      return res.json({ success: true, data: memoryPages[index] });
    }
    return res.status(404).json({ success: false, message: 'Page not found' });
  }
});

// DELETE /api/pages/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM pages WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Page deleted' });
  } catch (err) {
    memoryPages = memoryPages.filter(p => p.id !== parseInt(id));
    return res.json({ success: true, message: 'Page deleted' });
  }
});

module.exports = router;
