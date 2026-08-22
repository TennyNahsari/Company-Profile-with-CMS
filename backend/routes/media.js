const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

let memoryMedia = [
  {
    id: 1,
    filename: 'hero-banner-tech.jpg',
    filepath: '/uploads/hero-banner-tech.jpg',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
    mimetype: 'image/jpeg',
    size: 245120,
    created_at: '2026-08-22T10:00:00.000Z'
  },
  {
    id: 2,
    filename: 'design-system-preview.png',
    filepath: '/uploads/design-system-preview.png',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    mimetype: 'image/png',
    size: 512000,
    created_at: '2026-08-22T11:00:00.000Z'
  }
];

// GET /api/media (Admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM media ORDER BY id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryMedia });
  }
});

// POST /api/media/upload (Admin)
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const filepath = `/uploads/${req.file.filename}`;
  const fullUrl = `${req.protocol}://${req.get('host')}${filepath}`;

  try {
    const result = await db.query(
      'INSERT INTO media (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.file.originalname, filepath, req.file.mimetype, req.file.size]
    );
    return res.status(201).json({
      success: true,
      data: { ...result.rows[0], url: fullUrl }
    });
  } catch (err) {
    const newMedia = {
      id: Date.now(),
      filename: req.file.originalname,
      filepath,
      url: fullUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      created_at: new Date().toISOString()
    };
    memoryMedia.unshift(newMedia);
    return res.status(201).json({ success: true, data: newMedia });
  }
});

// DELETE /api/media/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM media WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err) {
    memoryMedia = memoryMedia.filter(m => m.id !== parseInt(id));
    return res.json({ success: true, message: 'Media asset deleted successfully.' });
  }
});

module.exports = router;
