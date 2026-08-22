const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryInquiries = [
  {
    id: 1,
    name: 'Mark Vance',
    email: 'mark.vance@techscale.io',
    company: 'TechScale SME',
    budget: '$25,000 - $50,000',
    service_interest: 'Web Development',
    message: 'Looking for a complete redesign of our enterprise SaaS portal with React and CMS backend.',
    status: 'NEW',
    created_at: '2026-08-22T14:20:00.000Z'
  }
];

// POST /api/inquiries (Public Contact Form)
router.post('/', async (req, res) => {
  const { name, email, company, budget, service_interest, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message fields are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO inquiries (name, email, company, budget, service_interest, message) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, company || '', budget || '', service_interest || '', message]
    );
    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! A DigiAgency strategist will contact you within 24 hours.',
      data: result.rows[0]
    });
  } catch (err) {
    const newInquiry = {
      id: Date.now(),
      name, email, company: company || '', budget: budget || '', service_interest: service_interest || '', message,
      status: 'NEW',
      created_at: new Date().toISOString()
    };
    memoryInquiries.unshift(newInquiry);
    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! A DigiAgency strategist will contact you within 24 hours.',
      data: newInquiry
    });
  }
});

// GET /api/inquiries (Admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inquiries ORDER BY id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryInquiries });
  }
});

// PUT /api/inquiries/:id/status (Admin)
router.put('/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query('UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryInquiries.find(i => i.id === parseInt(id));
    if (item) {
      item.status = status;
      return res.json({ success: true, data: item });
    }
    return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  }
});

module.exports = router;
