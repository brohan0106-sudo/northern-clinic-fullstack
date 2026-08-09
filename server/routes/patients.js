const express = require('express');
const bcrypt = require('bcryptjs');
const { readAll } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

function maskId(id) { return `••••${String(id).slice(-3)}`; }

// GET /api/patients — staff (admin, reception, clinician, billing); MRNs come back masked.
router.get('/', requireAuth, requireRole('clinician', 'reception', 'admin', 'billing'), async (req, res) => {
  const data = readAll();
  const rows = (data.patients || []).map(p => ({ ...p, id: maskId(p.id), _fullId: undefined }));
  res.json({ patients: rows });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: 'Viewed patient roster (MRNs masked)' });
});

// POST /api/patients/:id/reveal { password } — re-authenticates current user before returning unmasked MRN
router.post('/:id/reveal', requireAuth, requireRole('clinician', 'reception', 'admin'), async (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Re-enter your password to view this record.' });
  }

  const data = readAll();
  const user = data.users.find(u => u.username === req.user.username);
  const ok = user && bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Re-authentication failed while attempting to reveal MRN ${req.params.id}` });
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const patient = data.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found.' });

  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `<strong>PHI viewed:</strong> full MRN for patient #${patient.id} unmasked (re-authenticated)` });
  res.json({ id: patient.id });
});

// GET /api/patients/mine — the signed-in patient's own record.
router.get('/mine', requireAuth, requireRole('patient'), (req, res) => {
  const data = readAll();
  const me = (data.patients || []).find(p => p.name === req.user.name);
  res.json({ patient: me || null });
});

module.exports = router;
