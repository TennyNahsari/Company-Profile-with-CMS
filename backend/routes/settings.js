const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryFooter = {
  company_name: 'DigiAgency Aetheric',
  company_bio: 'Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.',
  office_address: 'Financial Tower Level 18, Pacific Boulevard, San Francisco, CA',
  contact_email: 'hello@digiagency.com',
  contact_phone: '+1 (555) 234-5678',
  copyright_text: '© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.',
  social_linkedin: 'https://linkedin.com',
  social_twitter: 'https://twitter.com',
  social_github: 'https://github.com',
  social_dribbble: 'https://dribbble.com'
};

// GET /api/settings/footer (Public)
router.get('/footer', async (req, res) => {
  try {
    const result = await db.query("SELECT value FROM site_settings WHERE key = 'footer'");
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].value });
    }
    return res.json({ success: true, data: memoryFooter });
  } catch (err) {
    return res.json({ success: true, data: memoryFooter });
  }
});

// PUT /api/settings/footer (Admin)
router.put('/footer', verifyToken, async (req, res) => {
  const footerData = req.body;
  try {
    const result = await db.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ('footer', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING value",
      [JSON.stringify(footerData)]
    );
    return res.json({ success: true, data: result.rows[0].value });
  } catch (err) {
    memoryFooter = { ...memoryFooter, ...footerData };
    return res.json({ success: true, data: memoryFooter });
  }
});

module.exports = router;
