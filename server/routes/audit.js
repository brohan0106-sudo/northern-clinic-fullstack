const express = require('express');
const { readAll } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit — hospital staff only; most recent entries first
router.get('/', requireAuth, requireRole('admin', 'reception', 'clinician', 'billing'), (req, res) => {
  const data = readAll();
  const rawLogs = data.auditLog || [];
  // Filter out any legacy dummy seed log entries
  const filtered = rawLogs.filter(e => !(e.action || '').includes('Data store seeded'));
  const recent = filtered.slice(-80).reverse();
  res.json({ entries: recent });
});

module.exports = router;
