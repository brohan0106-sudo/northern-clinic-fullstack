const express = require('express');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

// GET /api/claims — billing staff & admin
router.get('/', requireAuth, requireRole('billing', 'admin'), async (req, res) => {
  const data = readAll();
  res.json({ claims: data.claims || [] });
});

// POST /api/claims — Submit new insurance claim (Billing & Admin)
router.post('/', requireAuth, requireRole('billing', 'admin'), async (req, res) => {
  const { patient, payer, amount, procedureCode } = req.body || {};
  if (!patient || !payer || !amount) {
    return res.status(400).json({ error: 'Patient name, payer, and amount are required.' });
  }

  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`;
  const newClaim = {
    id: claimId,
    patient: patient.trim(),
    payer: payer.trim(),
    amount: Number(amount) || 120.00,
    status: 'Submitted',
    date: new Date().toISOString().split('T')[0],
    procedureCode: procedureCode || 'GP-01',
  };

  await update(data => {
    if (!data.claims) data.claims = [];
    data.claims.unshift(newClaim);
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Submitted new insurance claim #${claimId} for ${patient} ($${Number(amount).toFixed(2)})`,
  });

  res.status(201).json({ claim: newClaim, message: 'Insurance claim submitted successfully.' });
});

// POST /api/claims/export — billing staff only
router.post('/export', requireAuth, requireRole('billing', 'admin'), async (req, res) => {
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: 'Exported claims data to Excel' });
  res.json({ ok: true, filename: `claims_export_${Date.now()}.xlsx` });
});

// GET /api/claims/mine — signed-in patient
router.get('/mine', requireAuth, requireRole('patient'), (req, res) => {
  const data = readAll();
  const mine = (data.claims || []).filter(c => c.patient === req.user.name);
  res.json({ claims: mine });
});

module.exports = router;
