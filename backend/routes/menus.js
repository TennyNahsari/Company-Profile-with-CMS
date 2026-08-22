const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryMenus = [
  { id: 1, label: 'Home', url: '#hero', order_index: 1, is_external: false },
  { id: 2, label: 'About Us', url: '#about', order_index: 2, is_external: false },
  { id: 3, label: 'Services', url: '#services', order_index: 3, is_external: false },
  { id: 4, label: 'Portfolio', url: '#portfolio', order_index: 4, is_external: false },
  { id: 5, label: 'Blog', url: '#blog', order_index: 5, is_external: false },
  { id: 6, label: 'Contact', url: '#contact', order_index: 6, is_external: false }
];

// GET /api/menus
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menus ORDER BY order_index ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryMenus });
  }
});

// POST /api/menus (Admin)
router.post('/', verifyToken, async (req, res) => {
  const { label, url, order_index, is_external } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO menus (label, url, order_index, is_external) VALUES ($1, $2, $3, $4) RETURNING *',
      [label, url, order_index || 0, is_external || false]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newItem = {
      id: Date.now(),
      label, url, order_index: order_index || memoryMenus.length + 1, is_external: is_external || false
    };
    memoryMenus.push(newItem);
    return res.status(201).json({ success: true, data: newItem });
  }
});

// DELETE /api/menus/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menus WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    memoryMenus = memoryMenus.filter(m => m.id !== parseInt(id));
    return res.json({ success: true, message: 'Menu item deleted' });
  }
});

module.exports = router;
