const express = require('express');
const { v4: uuid } = require('uuid');
const { update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { validateDischargeSummary } = require('../utils/validate');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

// POST /api/discharge-summaries
router.post('/', requireAuth, requireRole('clinician'), async (req, res) => {
  const { valid, errors } = validateDischargeSummary(req.body || {});
  if (!valid) {
    return res.status(400).json({ error: 'Please complete all required fields before saving.', fields: errors });
  }

  const patientName = sanitizeText(req.body.patientName, { maxLength: 120 });
  const summary = {
    id: uuid(),
    patientName,
    clinician: req.user.name,
    chiefComplaint: sanitizeText(req.body.chiefComplaint, { maxLength: 120 }),
    findings: sanitizeText(req.body.findings, { maxLength: 500 }),
    therapy: sanitizeText(req.body.therapy, { maxLength: 500 }),
    recommendations: sanitizeText(req.body.recommendations, { maxLength: 500 }),
    labResults: sanitizeText(req.body.labResults, { maxLength: 500 }),
    ts: Date.now(),
  };

  await update((d) => {
    if (!d.dischargeSummaries) d.dischargeSummaries = [];
    d.dischargeSummaries.push(summary);

    // Automatically generate itemized care invoice for patient
    if (!d.invoices) d.invoices = [];
    const existsInv = d.invoices.find(i => i.patientName.toLowerCase() === patientName.toLowerCase() && i.status !== 'Paid');
    if (!existsInv) {
      const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const subtotal = 180.00;
      const insurerReimbursement = 135.00;
      const patientCoPay = 45.00;

      d.invoices.unshift({
        id: invId,
        patientName,
        date: new Date().toISOString().split('T')[0],
        items: [{ desc: `Clinical Consultation & Treatment — ${summary.chiefComplaint}`, fee: subtotal }],
        subtotal,
        insurerReimbursement,
        patientCoPay,
        status: 'Issued',
      });
    }
  });

  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Saved a discharge summary & generated care invoice for ${patientName}` });
  res.status(201).json({ summary });
});

module.exports = router;
