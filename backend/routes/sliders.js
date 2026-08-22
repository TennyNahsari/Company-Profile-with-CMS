const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memorySliders = [
  {
    id: 1,
    title: 'Innovators Without Borders',
    subtitle: 'We architect futuristic digital experiences, AI-driven marketing campaigns, and high-conversion web platforms for ambitious global enterprises.',
    badge_text: 'NEXT-GEN DIGITAL AGENCY',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
    cta_text: 'Explore Our Work',
    cta_link: '#portfolio',
    order_index: 1,
    is_active: true
  },
  {
    id: 2,
    title: 'Scale Your B2B Digital Presence',
    subtitle: 'Transforming complex business strategies into elegant digital products that drive quantifiable ROI and market dominance.',
    badge_text: 'RESULTS-DRIVEN STRATEGY',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
    cta_text: 'Book A Consultation',
    cta_link: '#contact',
    order_index: 2,
    is_active: true
  },
  {
    id: 3,
    title: 'Crafting Iconic Visual Identities',
    subtitle: 'From intuitive UI/UX design systems to full-spectrum digital branding that captivates target audiences.',
    badge_text: 'AETHERIC DESIGN SYSTEM',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200',
    cta_text: 'View Services',
    cta_link: '#services',
    order_index: 3,
    is_active: true
  }
];

// GET /api/sliders (Public)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sliders WHERE is_active = true ORDER BY order_index ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memorySliders });
  }
});

// POST /api/sliders (Admin)
router.post('/', verifyToken, async (req, res) => {
  const { title, subtitle, badge_text, image_url, cta_text, cta_link, order_index } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO sliders (title, subtitle, badge_text, image_url, cta_text, cta_link, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, subtitle, badge_text, image_url, cta_text, cta_link, order_index || 0]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newSlide = {
      id: Date.now(),
      title, subtitle, badge_text, image_url, cta_text, cta_link, order_index: order_index || memorySliders.length + 1, is_active: true
    };
    memorySliders.push(newSlide);
    return res.status(201).json({ success: true, data: newSlide });
  }
});

// DELETE /api/sliders/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM sliders WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Slide deleted successfully.' });
  } catch (err) {
    memorySliders = memorySliders.filter(s => s.id !== parseInt(id));
    return res.json({ success: true, message: 'Slide deleted successfully.' });
  }
});

module.exports = router;
