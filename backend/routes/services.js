const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryCategories = [
  { id: 1, name: 'UI/UX & Product Design', slug: 'ui-ux-product-design', order_index: 1 },
  { id: 2, name: 'Full-Stack Development', slug: 'full-stack-development', order_index: 2 },
  { id: 3, name: 'Growth & SEO Marketing', slug: 'growth-seo-marketing', order_index: 3 },
  { id: 4, name: 'Brand Strategy', slug: 'brand-strategy-category', order_index: 4 }
];

let memoryServices = [
  {
    id: 1,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    category_id: 1,
    icon_name: 'Layout',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    summary: 'User-centric interface design and design systems tailored for seamless engagement.',
    description: 'We craft high-fidelity prototypes, interactive user flows, and enterprise design systems using our Aetheric Design methodology.',
    features: ['Design Systems', 'User Research & Testing', 'Wireframing & Prototyping', 'Mobile-First UX Strategy'],
    order_index: 1
  },
  {
    id: 2,
    title: 'Web Development',
    slug: 'web-development',
    category_id: 2,
    icon_name: 'Code',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    summary: 'Scalable, modern web apps and high-speed platforms built with React, Node, and Cloud architecture.',
    description: 'Full-stack engineering leveraging cutting-edge frameworks, robust database design, and sub-second page performance.',
    features: ['React & Modern JS Frameworks', 'Node.js REST APIs', 'PostgreSQL & Database Optimization', 'CMS Architecture & CPanel Deployment'],
    order_index: 2
  },
  {
    id: 3,
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    category_id: 3,
    icon_name: 'TrendingUp',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    summary: 'Data-driven performance marketing, SEO mastery, and conversion rate optimization.',
    description: 'Accelerate business growth through strategic paid campaigns, technical SEO, content strategies, and continuous A/B testing.',
    features: ['Search Engine Optimization (SEO)', 'Paid Search & Meta Ads', 'Conversion Rate Optimization (CRO)', 'Marketing Automation & Analytics'],
    order_index: 3
  },
  {
    id: 4,
    title: 'Brand Strategy',
    slug: 'brand-strategy',
    category_id: 4,
    icon_name: 'Sparkles',
    thumbnail_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000',
    summary: 'Distinct visual identities, strategic messaging, and brand guidelines that resonate.',
    description: 'We elevate your market position with comprehensive brand strategy, visual style guides, and impactful digital collateral.',
    features: ['Brand Positioning & Tone of Voice', 'Visual Identity Systems', 'Digital Collateral & Assets', 'Brand Guidelines & Toolkits'],
    order_index: 4
  }
];

// Ensure DB schema has thumbnail_url column
(async () => {
  try {
    await db.query('ALTER TABLE services ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;');
  } catch (e) {}
})();

// ==========================================
// CATEGORIES ROUTES (MUST BE DEFINED FIRST)
// ==========================================

// GET /api/services/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM service_categories ORDER BY order_index ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryCategories });
  }
});

// POST /api/services/categories (Admin)
router.post('/categories', verifyToken, async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  try {
    const result = await db.query(
      'INSERT INTO service_categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug RETURNING *',
      [name, cleanSlug, description || '']
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newCat = {
      id: Date.now(),
      name,
      slug: cleanSlug,
      description: description || '',
      order_index: memoryCategories.length + 1
    };
    memoryCategories.push(newCat);
    return res.status(201).json({ success: true, data: newCat });
  }
});

// DELETE /api/services/categories/:id (Admin)
router.delete('/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM service_categories WHERE id = $1', [parseInt(id)]);
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    memoryCategories = memoryCategories.filter(c => c.id !== parseInt(id));
    return res.json({ success: true, message: 'Category deleted' });
  }
});

// ==========================================
// SERVICES COLLECTION ROUTES
// ==========================================

// GET /api/services (Public List)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug 
      FROM services s 
      LEFT JOIN service_categories sc ON s.category_id = sc.id 
      ORDER BY s.order_index ASC, s.id ASC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryServices });
  }
});

// POST /api/services (Admin - Create)
router.post('/', verifyToken, async (req, res) => {
  const { title, slug, category_id, icon_name, summary, description, features, order_index, thumbnail_url } = req.body;
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;
  const cleanThumb = thumbnail_url || null;
  
  try {
    const result = await db.query(
      'INSERT INTO services (title, slug, category_id, icon_name, summary, description, features, order_index, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, order_index || 0, cleanThumb]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Services Create Error:', err.message);
    const newService = {
      id: Date.now(),
      title,
      slug: cleanSlug,
      category_id: cleanCatId,
      icon_name: icon_name || 'Layout',
      thumbnail_url: cleanThumb,
      summary: summary || '',
      description: description || '',
      features: Array.isArray(features) ? features : JSON.parse(featuresJson),
      order_index: order_index || memoryServices.length + 1
    };
    memoryServices.push(newService);
    return res.status(201).json({ success: true, data: newService });
  }
});

// ==========================================
// DYNAMIC ITEM PARAMETER ROUTES (DEFINED LAST)
// ==========================================

// GET /api/services/:id (Public Item Detail)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const isIdNum = !isNaN(id);
    const queryStr = isIdNum 
      ? 'SELECT s.*, sc.name as category_name, sc.slug as category_slug FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.id = $1 OR s.slug = $2'
      : 'SELECT s.*, sc.name as category_name, sc.slug as category_slug FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.slug = $1';
    const params = isIdNum ? [parseInt(id), id] : [id];
    
    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryServices.find(s => s.id === parseInt(id) || s.slug === id);
    if (!item) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.json({ success: true, data: item });
  }
});

// PUT /api/services/:id (Admin - Update Item)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, category_id, icon_name, summary, description, features, order_index, thumbnail_url } = req.body;
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;
  const cleanThumb = thumbnail_url || null;

  try {
    const isIdNum = !isNaN(id);
    const queryStr = isIdNum
      ? 'UPDATE services SET title = $1, slug = $2, category_id = $3, icon_name = $4, summary = $5, description = $6, features = $7, order_index = $8, thumbnail_url = $9 WHERE id = $10 OR slug = $11 RETURNING *'
      : 'UPDATE services SET title = $1, slug = $2, category_id = $3, icon_name = $4, summary = $5, description = $6, features = $7, order_index = $8, thumbnail_url = $9 WHERE slug = $10 RETURNING *';
    const params = isIdNum 
      ? [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, order_index || 0, cleanThumb, parseInt(id), id]
      : [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, order_index || 0, cleanThumb, id];

    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found to update' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Services Update Error:', err.message);
    const idx = memoryServices.findIndex(s => s.id === parseInt(id) || s.slug === id);
    if (idx !== -1) {
      memoryServices[idx] = {
        ...memoryServices[idx],
        title,
        slug: cleanSlug,
        category_id: cleanCatId,
        icon_name: icon_name || memoryServices[idx].icon_name,
        thumbnail_url: cleanThumb !== undefined ? cleanThumb : memoryServices[idx].thumbnail_url,
        summary: summary || memoryServices[idx].summary,
        description: description || memoryServices[idx].description,
        features: Array.isArray(features) ? features : JSON.parse(featuresJson),
        order_index: order_index || memoryServices[idx].order_index
      };
      return res.json({ success: true, data: memoryServices[idx] });
    }
    return res.status(404).json({ success: false, message: 'Service not found to update' });
  }
});

// DELETE /api/services/:id (Admin - Delete Item)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM services WHERE id = $1 OR slug = $2', [isNaN(id) ? -1 : parseInt(id), id]);
    return res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    memoryServices = memoryServices.filter(s => s.id !== parseInt(id) && s.slug !== id);
    return res.json({ success: true, message: 'Service deleted' });
  }
});

module.exports = router;
