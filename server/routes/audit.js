const express = require('express');
const { readAll } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit — staff only; most recent entries first
router.get('/', requireAuth, requireRole('reception', 'clinician', 'billing'), (req, res) => {
  const data = readAll();
  const recent = data.auditLog.slice(-80).reverse();
  res.json({ entries: recent });
});

module.exports = router;
