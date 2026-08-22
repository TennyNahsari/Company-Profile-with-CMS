const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryPortfolioCategories = [
  { id: 1, name: 'UI/UX Design', slug: 'ui-ux-design', order_index: 1 },
  { id: 2, name: 'Web Development', slug: 'web-development', order_index: 2 },
  { id: 3, name: 'Digital Marketing', slug: 'digital-marketing', order_index: 3 },
  { id: 4, name: 'Mobile Apps', slug: 'mobile-apps', order_index: 4 }
];

let memoryProjects = [
  {
    id: 1,
    title: 'FinTech NeoBank Digital Portal',
    slug: 'fintech-neobank-portal',
    client_name: 'Aether Finance',
    category_id: 2,
    category: 'Web Development',
    thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000',
    summary: 'Redesigned core web application platform increasing conversion by 145%.',
    outcomes: { conversion_increase: '145%', user_retention: '88%', speed_score: '99/100' },
    content_html: '<h3>Project Scope & Execution</h3><p>We designed a high-contrast glassmorphic design system for Aether Finance, reducing onboarding steps from 9 to 3 while optimizing application performance.</p>',
    featured: true
  },
  {
    id: 2,
    title: 'SaaS Analytics Dashboard Redesign',
    slug: 'saas-analytics-dashboard',
    client_name: 'DataPulse Inc.',
    category_id: 1,
    category: 'UI/UX Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    summary: 'Built a modular dark-mode dashboard system for high-volume enterprise telemetry.',
    outcomes: { session_duration: '+320%', churn_reduction: '24%', nps_score: '78' },
    content_html: '<h3>Engineering Details</h3><p>Transformed telemetry visualizer into custom SVG canvas graphs with real-time WebSocket state management.</p>',
    featured: true
  },
  {
    id: 3,
    title: 'Global Ecommerce Performance Campaign',
    slug: 'ecommerce-performance-campaign',
    client_name: 'Luminary Apparel',
    category_id: 3,
    category: 'Digital Marketing',
    thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000',
    summary: 'Multi-channel acquisition strategy driving 4.2x ROAS across European markets.',
    outcomes: { roas: '4.2x', new_customers: '45,000+', revenue_growth: '+210%' },
    content_html: '<h3>Growth Campaign Strategy</h3><p>Implemented targeted dynamic retargeting ads coupled with landing page optimization to capture high-intent buyers.</p>',
    featured: true
  }
];

// ==========================================
// CATEGORIES ROUTES (DEFINED FIRST)
// ==========================================

// GET /api/projects/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM portfolio_categories ORDER BY order_index ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryPortfolioCategories });
  }
});

// POST /api/projects/categories (Admin)
router.post('/categories', verifyToken, async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  try {
    const result = await db.query(
      'INSERT INTO portfolio_categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug RETURNING *',
      [name, cleanSlug, description || '']
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newCat = {
      id: Date.now(),
      name,
      slug: cleanSlug,
      description: description || '',
      order_index: memoryPortfolioCategories.length + 1
    };
    memoryPortfolioCategories.push(newCat);
    return res.status(201).json({ success: true, data: newCat });
  }
});

// DELETE /api/projects/categories/:id (Admin)
router.delete('/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM portfolio_categories WHERE id = $1', [parseInt(id)]);
    return res.json({ success: true, message: 'Portfolio category deleted' });
  } catch (err) {
    memoryPortfolioCategories = memoryPortfolioCategories.filter(c => c.id !== parseInt(id));
    return res.json({ success: true, message: 'Portfolio category deleted' });
  }
});

// ==========================================
// PROJECTS COLLECTION ROUTES
// ==========================================

// GET /api/projects (Public List)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug 
      FROM projects p 
      LEFT JOIN portfolio_categories pc ON p.category_id = pc.id 
      ORDER BY p.id DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryProjects });
  }
});

// POST /api/projects (Admin - Create)
router.post('/', verifyToken, async (req, res) => {
  const { title, slug, client_name, category_id, category, thumbnail_url, summary, outcomes, content_html, featured } = req.body;
  const outcomesJson = typeof outcomes === 'string' ? outcomes : JSON.stringify(outcomes || {});
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;

  try {
    const result = await db.query(
      'INSERT INTO projects (title, slug, client_name, category_id, category, thumbnail_url, summary, outcomes, content_html, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, cleanSlug, client_name || '', cleanCatId, category || '', thumbnail_url || '', summary || '', outcomesJson, content_html || '', featured || false]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Projects Create Error:', err.message);
    const newProj = {
      id: Date.now(),
      title,
      slug: cleanSlug,
      client_name: client_name || '',
      category_id: cleanCatId,
      category: category || '',
      thumbnail_url: thumbnail_url || '',
      summary: summary || '',
      outcomes: typeof outcomes === 'object' ? outcomes : JSON.parse(outcomesJson),
      content_html: content_html || '',
      featured: featured || false
    };
    memoryProjects.push(newProj);
    return res.status(201).json({ success: true, data: newProj });
  }
});

// ==========================================
// DYNAMIC ITEM PARAMETER ROUTES (DEFINED LAST)
// ==========================================

// GET /api/projects/:id (Public Item Detail)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const isIdNum = !isNaN(id);
    const queryStr = isIdNum
      ? 'SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM projects p LEFT JOIN portfolio_categories pc ON p.category_id = pc.id WHERE p.id = $1 OR p.slug = $2'
      : 'SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM projects p LEFT JOIN portfolio_categories pc ON p.category_id = pc.id WHERE p.slug = $1';
    const params = isIdNum ? [parseInt(id), id] : [id];

    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryProjects.find(p => p.id === parseInt(id) || p.slug === id);
    if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, data: item });
  }
});

// PUT /api/projects/:id (Admin - Update)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, client_name, category_id, category, thumbnail_url, summary, outcomes, content_html, featured } = req.body;
  const outcomesJson = typeof outcomes === 'string' ? outcomes : JSON.stringify(outcomes || {});
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;

  try {
    const isIdNum = !isNaN(id);
    const queryStr = isIdNum
      ? 'UPDATE projects SET title = $1, slug = $2, client_name = $3, category_id = $4, category = $5, thumbnail_url = $6, summary = $7, outcomes = $8, content_html = $9, featured = $10 WHERE id = $11 OR slug = $12 RETURNING *'
      : 'UPDATE projects SET title = $1, slug = $2, client_name = $3, category_id = $4, category = $5, thumbnail_url = $6, summary = $7, outcomes = $8, content_html = $9, featured = $10 WHERE slug = $11 RETURNING *';
    const params = isIdNum
      ? [title, cleanSlug, client_name || '', cleanCatId, category || '', thumbnail_url || '', summary || '', outcomesJson, content_html || '', featured || false, parseInt(id), id]
      : [title, cleanSlug, client_name || '', cleanCatId, category || '', thumbnail_url || '', summary || '', outcomesJson, content_html || '', featured || false, id];

    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found to update' });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Projects Update Error:', err.message);
    const idx = memoryProjects.findIndex(p => p.id === parseInt(id) || p.slug === id);
    if (idx !== -1) {
      memoryProjects[idx] = {
        ...memoryProjects[idx],
        title,
        slug: cleanSlug,
        client_name: client_name || memoryProjects[idx].client_name,
        category_id: cleanCatId,
        category: category || memoryProjects[idx].category,
        thumbnail_url: thumbnail_url || memoryProjects[idx].thumbnail_url,
        summary: summary || memoryProjects[idx].summary,
        outcomes: typeof outcomes === 'object' ? outcomes : JSON.parse(outcomesJson),
        content_html: content_html || memoryProjects[idx].content_html,
        featured: featured !== undefined ? featured : memoryProjects[idx].featured
      };
      return res.json({ success: true, data: memoryProjects[idx] });
    }
    return res.status(404).json({ success: false, message: 'Project not found to update' });
  }
});

// DELETE /api/projects/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM projects WHERE id = $1 OR slug = $2', [isNaN(id) ? -1 : parseInt(id), id]);
    return res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    memoryProjects = memoryProjects.filter(p => p.id !== parseInt(id) && p.slug !== id);
    return res.json({ success: true, message: 'Project deleted' });
  }
});

module.exports = router;
